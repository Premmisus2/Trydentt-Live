import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomUUID } from 'node:crypto';

// SHA-256 hash per Meta's Customer Information Parameters spec:
// trim whitespace, lowercase, hash.
const hash = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return undefined;
  return createHash('sha256').update(normalized).digest('hex');
};

// Normalize phone to digits with country code (Canada/US → leading 1).
const normalizePhone = (phone?: string): string | undefined => {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return digits;
  return digits || undefined;
};

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  phonePrefix?: string;
  postalCode?: string;
  address?: string;
  city?: string;
  niche?: string;
  service?: string;
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
  // SKU calculator fields (added 2026-05-10 — Trydentt Meta relaunch).
  // See /Documents/Premmisus/Clients/Trydentt/research/synthesis-trydentt-meta-relaunch-2026-05-10.md
  sku?: 'move-out' | 'bi-weekly' | 'friday-reset' | 'class-a-office';
  bedrooms?: number;
  bathrooms?: number;
  addons?: string[];
  frequency?: 'one-time' | 'weekly' | 'biweekly';
  annualLockIn?: boolean;
}

const GRAPH_API_VERSION = 'v21.0';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const body: LeadPayload =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

  if (!body.name || !body.phone) {
    res.status(400).json({ ok: false, error: 'Missing required fields: name, phone' });
    return;
  }

  const eventId = body.event_id || randomUUID();
  const eventTime = Math.floor(Date.now() / 1000);
  const ghlWebhook = process.env.GHL_QUOTE_WEBHOOK;
  const pixelId = process.env.META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  const clientIp =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
    (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress ||
    undefined;
  const userAgent =
    body.client_user_agent ||
    (req.headers['user-agent'] as string | undefined) ||
    undefined;

  const normalizedPhone = normalizePhone(body.phone);
  const [firstName, ...rest] = (body.name || '').trim().split(/\s+/);
  const lastName = rest.join(' ') || undefined;
  const normalizedPostal = body.postalCode?.replace(/\s+/g, '').toLowerCase();

  // GHL fan-out — preserves exact current payload shape.
  const ghlPayload = { ...body, event_id: eventId };
  const ghlPromise = ghlWebhook
    ? fetch(ghlWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ghlPayload),
      })
        .then(async (r) => ({ ok: r.ok, status: r.status }))
        .catch((err: unknown) => ({
          ok: false,
          status: 0,
          error: err instanceof Error ? err.message : String(err),
        }))
    : Promise.resolve({ ok: false, status: 0, error: 'GHL_QUOTE_WEBHOOK not configured' });

  // GHL contacts/upsert — direct API call to map SKU-specific custom fields.
  // Locked 2026-05-12 to fix the W19 launch issue where the webhook flow didn't map new SKU fields.
  // Custom field IDs created 2026-05-10 (see synthesis-trydentt-meta-relaunch-2026-05-10.md § 8).
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

  const ghlApiKey = process.env.GHL_API_KEY;
  const ghlLocationId = process.env.GHL_LOCATION_ID;
  const customFields: { id: string; key?: string; field_value: string | number | boolean }[] = [];
  if (body.sku && SKU_VALUE_MAP[body.sku]) customFields.push({ id: GHL_FIELDS.SKU, field_value: SKU_VALUE_MAP[body.sku] });
  if (typeof body.bedrooms === 'number') customFields.push({ id: GHL_FIELDS.Bedrooms, field_value: body.bedrooms });
  if (typeof body.bathrooms === 'number') customFields.push({ id: GHL_FIELDS.Bathrooms, field_value: body.bathrooms });
  if (body.frequency && FREQUENCY_VALUE_MAP[body.frequency]) customFields.push({ id: GHL_FIELDS.Frequency, field_value: FREQUENCY_VALUE_MAP[body.frequency] });
  if (typeof body.minPrice === 'number') customFields.push({ id: GHL_FIELDS.QuotedPrice, field_value: body.minPrice });
  if (body.annualLockIn === true) customFields.push({ id: GHL_FIELDS.AnnualLockIn, field_value: 'Yes' });
  if (Array.isArray(body.addons) && body.addons.length > 0) customFields.push({ id: GHL_FIELDS.AddonsSelected, field_value: body.addons.join(', ') });

  // Commercial-specific (Class-A Office Standard) — parsed from serviceDetails per Commercial.tsx
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

  const ghlApiEnabled = Boolean(ghlApiKey && ghlLocationId);
  const ghlApiPromise = ghlApiEnabled
    ? fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ghlApiKey}`,
          Version: '2021-07-28',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: ghlLocationId,
          firstName,
          lastName,
          email: body.email,
          phone: normalizedPhone ? `+${normalizedPhone}` : body.phone,
          address1: body.address,
          city: body.city,
          postalCode: body.postalCode,
          source: body.source || 'Trydentt Website',
          tags: [body.sku, body.utm_campaign].filter(Boolean) as string[],
          customFields,
        }),
      })
        .then(async (r) => {
          const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
          return { ok: r.ok, status: r.status, contactId: (json.contact as { id?: string } | undefined)?.id };
        })
        .catch((err: unknown) => ({
          ok: false,
          status: 0,
          error: err instanceof Error ? err.message : String(err),
        }))
    : Promise.resolve({ ok: false, status: 0, error: 'GHL_API_KEY or GHL_LOCATION_ID not configured', skipped: true });

  // Meta CAPI Lead event — dedup on event_id with client-side Pixel.
  const capiEnabled = Boolean(pixelId && capiToken);
  const capiPromise: Promise<unknown> = capiEnabled
    ? fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${capiToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [
              {
                event_name: 'Lead',
                event_time: eventTime,
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
                  content_name: body.service || 'Residential Cleaning Quote',
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
        }
      )
        .then(async (r) => {
          const json = (await r.json().catch(() => ({}))) as Record<string, unknown>;
          return { ok: r.ok, status: r.status, ...json };
        })
        .catch((err: unknown) => ({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        }))
    : Promise.resolve({ ok: false, skipped: true });

  const [ghlResult, ghlApiResult, capiResult] = await Promise.all([ghlPromise, ghlApiPromise, capiPromise]);

  // Success if EITHER GHL path (webhook or direct API) accepted the lead.
  // Webhook is the legacy primary; direct API enriches with custom fields and is now the more reliable path.
  const success = (ghlResult as { ok: boolean }).ok || (ghlApiResult as { ok: boolean }).ok;
  res.status(success ? 200 : 502).json({
    ok: success,
    eventId,
    ghl: ghlResult,
    ghlApi: ghlApiResult,
    capi: capiResult,
  });
}
