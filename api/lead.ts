import type { VercelRequest, VercelResponse } from '@vercel/node';
import { waitUntil } from '@vercel/functions';
import { createHash, randomUUID } from 'node:crypto';

// Every site form posts here. The form gets its answer straight away; the lead
// is then delivered after the response (waitUntil) to each leg that has its
// settings: the Trydentt Sheet (row + email from homes@), a text to the owner,
// GHL (until the Sheet is proven) and Meta CAPI. GET reports which legs are on.

// SHA-256 hash per Meta's Customer Information Parameters spec:
// trim whitespace, lowercase, hash.
const hash = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
};

// Normalize phone to digits with country code (Canada/US: leading 1).
const normalizePhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return digits;
  return digits || undefined;
};

// "(519) 555-0142" for the alert text; falls back to whatever was typed.
const displayPhone = (phone?: string): string | undefined => {
  const digits = normalizePhone(phone);
  if (digits?.length === 11) return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return phone?.trim() || undefined;
};

// Customer-typed text on one line and capped, so it can't blow up the SMS.
const oneLine = (raw: unknown, max = 80): string =>
  String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  phonePrefix?: string;
  postalCode?: string;
  zip?: string;
  address?: string;
  city?: string;
  niche?: string;
  service?: string;
  type?: string;
  message?: string;
  sqft?: number;
  minPrice?: number;
  maxPrice?: number;
  estimate?: string;
  serviceDetails?: string[];
  source?: string;
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  event_id?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
  // SKU calculator fields (added 2026-05-10, Trydentt Meta relaunch).
  // See /Documents/Premmisus/Clients/Trydentt/research/synthesis-trydentt-meta-relaunch-2026-05-10.md
  // Landing-page hero forms send the display name ("Move-Out Recovery System") instead of the code.
  sku?: string;
  bedrooms?: number;
  bathrooms?: number;
  addons?: string[];
  frequency?: 'one-time' | 'weekly' | 'biweekly';
  annualLockIn?: boolean;
}

type LegResult = { ok: boolean; status?: number; skipped?: boolean; error?: string; [key: string]: unknown };

const failed = (err: unknown): LegResult => ({
  ok: false,
  status: 0,
  error: err instanceof Error ? err.message : String(err),
});

const GRAPH_API_VERSION = 'v21.0';
const SHEET_TIMEOUT_MS = 20_000;

// GHL custom field IDs created 2026-05-10 (see synthesis-trydentt-meta-relaunch-2026-05-10.md § 8).
const GHL_FIELDS = {
  SKU:                'qAAgvClbJypC2oRytwh0',
  Bedrooms:           'pilQzcu36c4v8134urN9',
  Bathrooms:          'iGeeGPLcJKDbBB0TlrPN',
  Frequency:          'FeYU7YM3vV5pgGAmrvAc',
  QuotedPrice:        'D8IFqKDvu3apxHx5DePZ',
  AnnualLockIn:       'pOuYn7R7DaStCgV6FO1C',
  AddonsSelected:     'Wp6n6dERDHp7sb26ieoT',
  BusinessName:       'P2WJVApaeym5cI8Jn0Tl',
  BuildingType:       '7JpUVwjnjLN2WcdstaO4',
  CurrentCleanerSetup:'joejB67jH5YoMc0ksZpi',
  DecisionMakerRole:  'XyFbnn4oRYTjosuEfH57',
};
const SKU_VALUE_MAP: Record<string, string> = {
  'move-out':       'Move-Out Recovery System',
  'bi-weekly':      'Bi-Weekly Reset Program',
  'friday-reset':   'Friday Reset',
  'class-a-office': 'Class-A Office Standard',
};
const FREQUENCY_VALUE_MAP: Record<string, string> = {
  'one-time': 'One-time',
  'weekly':   'Weekly',
  'biweekly': 'Bi-weekly',
};

// The Contact form never fed the quote workflow, so it doesn't start now.
const GHL_WEBHOOK_SKIP_SOURCES = new Set(['Contact Page Form']);

const skuLabel = (sku?: string): string | undefined => {
  if (!sku) return undefined;
  if (SKU_VALUE_MAP[sku]) return SKU_VALUE_MAP[sku];
  return Object.values(SKU_VALUE_MAP).includes(sku) ? sku : undefined;
};

const isCommercial = (body: LeadPayload): boolean =>
  body.niche === 'commercial' || body.type === 'Commercial' || body.sku === 'class-a-office';

// Account SID plus either a dedicated API key (preferred, revocable on its own) or the auth token.
const twilioAuth = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const user = process.env.TWILIO_API_KEY_SID || accountSid;
  const pass = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;
  return accountSid && user && pass ? { accountSid, user, pass } : undefined;
};

const smsRecipients = (): string[] =>
  (process.env.LEAD_SMS_TO || '').split(',').map((n) => n.trim()).filter(Boolean);

const legsConfigured = () => ({
  sheet: Boolean(process.env.TC_SHEET_WEBHOOK_URL && process.env.TC_SHEET_WEBHOOK_SECRET),
  sms: Boolean(twilioAuth() && process.env.LEAD_SMS_FROM && smsRecipients().length),
  ghlWebhook: Boolean(process.env.GHL_QUOTE_WEBHOOK),
  ghlApi: Boolean(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID),
  capi: Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN),
});

// What the Sheet row and the alert text are built from.
const leadSummary = (body: LeadPayload, eventId: string) => ({
  eventId,
  tab: isCommercial(body) ? 'Commercial' : 'Residential',
  name: oneLine(body.name, 60),
  phone: displayPhone(body.phonePrefix && body.phone && !body.phone.startsWith('+') ? `${body.phonePrefix}${body.phone}` : body.phone) || '',
  email: oneLine(body.email, 80),
  service: oneLine(skuLabel(body.sku) || body.service || body.type || (isCommercial(body) ? 'Commercial cleaning' : 'Residential cleaning'), 60),
  postalCode: oneLine(body.postalCode || body.zip, 10).toUpperCase(),
  address: oneLine([body.address, body.city].filter(Boolean).join(', '), 120),
  estimate: typeof body.minPrice === 'number' && typeof body.maxPrice === 'number' ? `$${body.minPrice} to $${body.maxPrice}` : oneLine(body.estimate, 40),
  details: oneLine([...(body.serviceDetails || []), body.message].filter(Boolean).join(' | '), 1000),
  source: oneLine(body.source || 'Trydentt Website', 80),
  page: oneLine(body.landing_page, 300),
  utm: oneLine([body.utm_source, body.utm_medium, body.utm_campaign].filter(Boolean).join(' / '), 120),
});

type Lead = ReturnType<typeof leadSummary>;

// Apps Script web app bound to the Sheet, running as homes@: dedupes under a
// lock, writes the row, emails homes@. Answers { ok, duplicate }.
async function sendToSheet(lead: Lead): Promise<LegResult> {
  const url = process.env.TC_SHEET_WEBHOOK_URL;
  const secret = process.env.TC_SHEET_WEBHOOK_SECRET;
  if (!url || !secret) return { ok: false, skipped: true, error: 'Sheet not configured' };
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, type: 'lead', lead }),
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });
    const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    return { ...json, ok: r.ok && json.ok === true, status: r.status, duplicate: json.duplicate === true };
  } catch (err) {
    return failed(err);
  }
}

// Plain text from the Cleaning number to the owner's phone(s).
async function sendSms(lead: Lead, sheet: LegResult): Promise<LegResult> {
  const auth = twilioAuth();
  const from = process.env.LEAD_SMS_FROM;
  const to = smsRecipients();
  if (!auth || !from || !to.length) return { ok: false, skipped: true, error: 'SMS not configured' };

  const lines = [
    `New ${lead.tab.toLowerCase()} lead from trydenttcleaning.ca`,
    lead.name,
    lead.phone,
    lead.email,
    [lead.service, lead.postalCode].filter(Boolean).join(', '),
    lead.estimate && `Estimate ${lead.estimate}`,
    lead.details && oneLine(lead.details, 120),
    !sheet.ok && !sheet.skipped && 'NOT saved to the Sheet, save it by hand',
    'Auto alert, replies to this number are not read',
  ];
  const text = lines.filter(Boolean).join('\n');

  const results = await Promise.all(
    to.map((recipient) =>
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${auth.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${auth.user}:${auth.pass}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ From: from, To: recipient, Body: text }).toString(),
      })
        .then(async (r) => {
          const json = (await r.json().catch(() => ({}))) as { sid?: string; message?: string };
          return { ok: r.ok, status: r.status, sid: json.sid, error: r.ok ? undefined : json.message };
        })
        .catch(failed)
    )
  );
  return { ok: results.every((r) => r.ok), messages: results };
}

// GHL inbound webhook: same payload the forms used to send it directly.
async function sendToGhlWebhook(body: LeadPayload, eventId: string): Promise<LegResult> {
  const url = process.env.GHL_QUOTE_WEBHOOK;
  if (!url) return { ok: false, skipped: true, error: 'GHL_QUOTE_WEBHOOK not configured' };
  if (body.source && GHL_WEBHOOK_SKIP_SOURCES.has(body.source)) return { ok: false, skipped: true, error: 'Not a quote form' };
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, event_id: eventId }),
    });
    return { ok: r.ok, status: r.status };
  } catch (err) {
    return failed(err);
  }
}

// GHL contacts/upsert: maps the SKU custom fields the webhook flow never did
// (locked 2026-05-12 to fix the W19 launch issue).
async function sendToGhlApi(body: LeadPayload): Promise<LegResult> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return { ok: false, skipped: true, error: 'GHL_API_KEY or GHL_LOCATION_ID not configured' };

  const normalizedPhone = normalizePhone(body.phone);
  const [firstName, ...rest] = (body.name || '').trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;
  const sku = skuLabel(body.sku);

  const customFields: { id: string; field_value: string | number | boolean }[] = [];
  if (sku) customFields.push({ id: GHL_FIELDS.SKU, field_value: sku });
  if (typeof body.bedrooms === 'number') customFields.push({ id: GHL_FIELDS.Bedrooms, field_value: body.bedrooms });
  if (typeof body.bathrooms === 'number') customFields.push({ id: GHL_FIELDS.Bathrooms, field_value: body.bathrooms });
  if (body.frequency && FREQUENCY_VALUE_MAP[body.frequency]) customFields.push({ id: GHL_FIELDS.Frequency, field_value: FREQUENCY_VALUE_MAP[body.frequency] });
  if (typeof body.minPrice === 'number') customFields.push({ id: GHL_FIELDS.QuotedPrice, field_value: body.minPrice });
  if (body.annualLockIn === true) customFields.push({ id: GHL_FIELDS.AnnualLockIn, field_value: 'Yes' });
  if (Array.isArray(body.addons) && body.addons.length > 0) customFields.push({ id: GHL_FIELDS.AddonsSelected, field_value: body.addons.join(', ') });

  // Commercial-specific (Class-A Office Standard), parsed from serviceDetails per Commercial.tsx.
  if (body.sku === 'class-a-office' && Array.isArray(body.serviceDetails)) {
    const detail = (prefix: string) => body.serviceDetails?.find((d) => d.startsWith(prefix))?.replace(prefix, '').trim();
    const biz = detail('Business: ');
    const role = detail('Role: ');
    const building = detail('Building: ');
    const cleaner = detail('Current cleaner: ');
    if (biz) customFields.push({ id: GHL_FIELDS.BusinessName, field_value: biz });
    if (role) customFields.push({ id: GHL_FIELDS.DecisionMakerRole, field_value: role });
    if (building) customFields.push({ id: GHL_FIELDS.BuildingType, field_value: building });
    if (cleaner) customFields.push({ id: GHL_FIELDS.CurrentCleanerSetup, field_value: cleaner });
  }

  try {
    const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email: body.email || undefined,
        phone: normalizedPhone ? `+${normalizedPhone}` : body.phone || undefined,
        address1: body.address,
        city: body.city,
        postalCode: body.postalCode || body.zip,
        source: body.source || 'Trydentt Website',
        tags: [sku || body.sku, body.utm_campaign].filter(Boolean) as string[],
        customFields,
      }),
    });
    const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: r.ok, status: r.status, contactId: (json.contact as { id?: string } | undefined)?.id };
  } catch (err) {
    return failed(err);
  }
}

// Meta CAPI Lead event, deduped on event_id with the client-side Pixel.
async function sendCapi(body: LeadPayload, eventId: string, clientIp?: string, userAgent?: string): Promise<LegResult> {
  const pixelId = process.env.META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;
  if (!pixelId || !capiToken) return { ok: false, skipped: true };

  const normalizedPhone = normalizePhone(body.phone);
  const [firstName, ...rest] = (body.name || '').trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;
  const normalizedPostal = (body.postalCode || body.zip)?.replace(/\s+/g, '').toLowerCase();

  try {
    const r = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${capiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          {
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: 'website',
            event_source_url: body.landing_page,
            user_data: {
              em: body.email ? [hash(body.email)] : undefined,
              ph: normalizedPhone ? [hash(normalizedPhone)] : undefined,
              fn: firstName ? [hash(firstName)] : undefined,
              ln: lastName ? [hash(lastName)] : undefined,
              zp: normalizedPostal ? [hash(normalizedPostal)] : undefined,
              ct: body.city ? [hash(body.city)] : undefined,
              country: [hash('ca')],
              client_ip_address: clientIp,
              client_user_agent: userAgent,
              fbp: body.fbp,
              fbc: body.fbc,
            },
            custom_data: {
              currency: 'CAD',
              value: body.minPrice ?? 150,
              content_name: body.service || skuLabel(body.sku) || 'Residential Cleaning Quote',
              content_category: body.niche || 'residential',
              lead_source: body.source,
              utm_source: body.utm_source,
              utm_medium: body.utm_medium,
              utm_campaign: body.utm_campaign,
              utm_content: body.utm_content,
              utm_term: body.utm_term,
            },
          },
        ],
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
    });
    const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
    return { ...json, ok: r.ok, status: r.status };
  } catch (err) {
    return failed(err);
  }
}

async function deliverLead(body: LeadPayload, eventId: string, clientIp?: string, userAgent?: string) {
  const lead = leadSummary(body, eventId);

  // The Sheet goes first so a duplicate submit doesn't text twice. If the
  // Sheet is configured but fails, the text says so.
  const sheetThenSms = sendToSheet(lead).then(async (sheet) => ({
    sheet,
    sms: sheet.duplicate ? ({ ok: true, skipped: true, error: 'Duplicate' } as LegResult) : await sendSms(lead, sheet),
  }));

  const [{ sheet, sms }, ghl, ghlApi, capi] = await Promise.all([
    sheetThenSms,
    sendToGhlWebhook(body, eventId),
    sendToGhlApi(body),
    sendCapi(body, eventId, clientIp, userAgent),
  ]);

  const results = { eventId, sheet, sms, ghl, ghlApi, capi };
  const delivered = [sheet, sms, ghl, ghlApi].some((r) => r.ok);
  if (delivered) {
    console.log('lead delivered', JSON.stringify(results));
  } else {
    // Nothing reached a person or a record: keep the lead in the logs so it can be recovered.
    console.error('LEAD NOT DELIVERED', JSON.stringify({ ...results, lead }));
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ ok: true, legs: legsConfigured() });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  let body: LeadPayload;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' });
    return;
  }

  if (!body.name || (!body.phone && !body.email)) {
    res.status(400).json({ ok: false, error: 'Missing required fields: name, and phone or email' });
    return;
  }

  const eventId = body.event_id || randomUUID();
  const clientIp =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
    (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress ||
    undefined;
  const userAgent =
    body.client_user_agent ||
    (req.headers['user-agent'] as string | undefined) ||
    undefined;

  // Answer the form now; deliver after the response so a slow leg never keeps the customer waiting.
  waitUntil(deliverLead(body, eventId, clientIp, userAgent));
  res.status(200).json({ ok: true, eventId });
}
