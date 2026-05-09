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

  const [ghlResult, capiResult] = await Promise.all([ghlPromise, capiPromise]);

  // GHL is primary — CAPI failure should not block the user experience.
  const success = (ghlResult as { ok: boolean }).ok;
  res.status(success ? 200 : 502).json({
    ok: success,
    eventId,
    ghl: ghlResult,
    capi: capiResult,
  });
}
