#!/usr/bin/env node
// Standalone CAPI validator — sends ONE synthetic Lead event to Meta's
// Conversions API with a test_event_code so Meta routes it to the Test
// Events panel instead of into ad optimization. Validates that
// META_PIXEL_ID + META_CAPI_TOKEN are correctly configured BEFORE we
// rely on real form submissions to prove the same thing.
//
// Usage:  node scripts/test-capi.mjs [test_event_code]
// Default test code: TRY_TEST_W19
//
// Reads credentials from .vercel/.env.production.local (populated by
// `vercel env pull --yes --environment=production`). Does NOT modify
// any file, deployment, or env var. Idempotent and safe to re-run.

import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';

const ENV_FILE = '.vercel/.env.production.local';
const TEST_CODE = process.argv[2] || 'TRY_TEST_W19';

// --- Load credentials from pulled production env file ---
let envText;
try {
  envText = readFileSync(ENV_FILE, 'utf8');
} catch (err) {
  console.error(`Could not read ${ENV_FILE}. Run "vercel env pull --yes --environment=production" first.`);
  process.exit(1);
}

const env = {};
for (const line of envText.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  env[m[1]] = v;
}

const pixelId = env.META_PIXEL_ID;
const capiToken = env.META_CAPI_TOKEN;
if (!pixelId || !capiToken) {
  console.error('Missing META_PIXEL_ID or META_CAPI_TOKEN in pulled env.');
  process.exit(1);
}

// --- Build a synthetic Lead event ---
const hash = (s) => createHash('sha256').update(s.trim().toLowerCase()).digest('hex');
const eventId = randomUUID();
const eventTime = Math.floor(Date.now() / 1000);

const payload = {
  data: [{
    event_name: 'Lead',
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    event_source_url: 'https://www.trydenttcleaning.ca/commercial',
    user_data: {
      em: [hash('capi-validator@trydenttcleaning.ca')],
      ph: [hash('15555550100')],
      fn: [hash('capi')],
      ln: [hash('validator')],
      country: [hash('ca')],
      client_user_agent: 'Mozilla/5.0 (Trydentt-CAPI-Validator/1.0)',
      client_ip_address: '8.8.8.8',
    },
    custom_data: {
      currency: 'CAD',
      value: 150,
      content_name: 'CAPI Validation Test (NOT a real lead)',
      content_category: 'commercial',
      lead_source: 'capi-test-harness',
    },
  }],
  test_event_code: TEST_CODE,
};

// --- POST to Meta Conversions API ---
const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${capiToken}`;
console.log(`POST ${url.replace(capiToken, '<REDACTED_TOKEN>')}`);
console.log(`Pixel:      ${pixelId}`);
console.log(`Event ID:   ${eventId}`);
console.log(`Test code:  ${TEST_CODE}`);
console.log('---');

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const responseText = await res.text();
let json;
try { json = JSON.parse(responseText); } catch { json = { raw: responseText }; }

console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(json, null, 2));
console.log('---');

if (res.ok && json.events_received === 1) {
  console.log('PASS — Meta accepted the Lead event.');
  console.log(`Open Meta Events Manager → Pixel ${pixelId} → Test Events → tab "${TEST_CODE}"`);
  console.log('The event should appear within ~60 seconds.');
  process.exit(0);
} else {
  console.log('FAIL — Meta rejected the event. Likely causes:');
  console.log('  - META_CAPI_TOKEN scoped to wrong pixel or expired');
  console.log('  - META_PIXEL_ID does not match the token');
  console.log('  - Insufficient permissions on the system user');
  console.log('See response body above for the exact Meta error.');
  process.exit(2);
}
