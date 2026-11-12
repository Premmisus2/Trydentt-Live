import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomUUID } from 'node:crypto';

// Every site form posts here. The lead is delivered to each leg that has its
// settings: the Trydentt Sheet (row + email from homes@), a text to the owner,
// the Trydentt Cleaning Telegram group and Meta CAPI. The form only hears "ok"
// once the lead has reached a person or a record (Sheet, text or Telegram). If
// nothing got it, the form is told so and shows the phone number instead of a
// thank-you. GET reports which legs are on. GHL was switched off 2026-11-12.

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
const TELEGRAM_TIMEOUT_MS = 8_000;

const SKU_VALUE_MAP: Record<string, string> = {
  'move-out':       'Move-Out Recovery System',
  'bi-weekly':      'Bi-Weekly Reset Program',
  'friday-reset':   'Friday Reset',
  'class-a-office': 'Class-A Office Standard',
};

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
  telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
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

// Telegram reads its alert as HTML, so customer text is escaped.
const escHtml = (raw: unknown): string =>
  String(raw ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The Trydentt Cleaning Telegram group, so the team sees every lead in one place.
async function sendTelegram(lead: Lead, sheet: LegResult): Promise<LegResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, skipped: true, error: 'Telegram not configured' };

  const lines: (string | null)[] = [
    `<b>NEW ${lead.tab.toUpperCase()} LEAD</b> (trydenttcleaning.ca)`,
    '',
    `<b>${escHtml(lead.name)}</b>`,
    lead.phone ? escHtml(lead.phone) : null,
    lead.email ? escHtml(lead.email) : null,
    escHtml([lead.service, lead.postalCode].filter(Boolean).join(', ')),
    lead.address ? escHtml(lead.address) : null,
    lead.estimate ? `Estimate shown: ${escHtml(lead.estimate)}` : null,
    lead.details ? escHtml(lead.details) : null,
    '',
    `Form: ${escHtml(lead.source)}`,
    sheet.ok ? 'Saved in the Sheet.' : sheet.skipped ? null : '<b>NOT saved to the Sheet, save it by hand.</b>',
  ];

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text: lines.filter((l) => l !== null).join('\n') }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
    });
    const json = (await r.json().catch(() => ({}))) as { description?: string };
    return { ok: r.ok, status: r.status, error: r.ok ? undefined : json.description };
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

  // The Sheet goes first so a duplicate submit doesn't alert twice. If the
  // Sheet is configured but fails, the text and the Telegram alert say so.
  const sheetThenAlerts = sendToSheet(lead).then(async (sheet) => {
    if (sheet.duplicate) {
      const duplicate: LegResult = { ok: true, skipped: true, error: 'Duplicate' };
      return { sheet, sms: duplicate, telegram: duplicate };
    }
    const [sms, telegram] = await Promise.all([sendSms(lead, sheet), sendTelegram(lead, sheet)]);
    return { sheet, sms, telegram };
  });

  const [{ sheet, sms, telegram }, capi] = await Promise.all([
    sheetThenAlerts,
    sendCapi(body, eventId, clientIp, userAgent),
  ]);

  const results = { eventId, sheet, sms, telegram, capi };
  const delivered = [sheet, sms, telegram].some((r) => r.ok && !r.skipped);
  if (delivered) {
    console.log('lead delivered', JSON.stringify(results));
  } else {
    // Nothing reached a person or a record: keep the lead in the logs so it can be recovered.
    console.error('LEAD NOT DELIVERED', JSON.stringify({ ...results, lead }));
  }
  return delivered;
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

  // Wait for delivery: the visitor only sees a thank-you once someone has the lead.
  let delivered = false;
  try {
    delivered = await deliverLead(body, eventId, clientIp, userAgent);
  } catch (err) {
    console.error('LEAD DELIVERY CRASHED', err instanceof Error ? err.message : String(err));
  }
  if (!delivered) {
    res.status(502).json({ ok: false, eventId, error: 'Not delivered. Please call (519) 871-3368.' });
    return;
  }
  res.status(200).json({ ok: true, eventId });
}
