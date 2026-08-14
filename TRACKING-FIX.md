# Trydentt — Google Ads Conversion Tracking Fix (staged 2026-06-06)

**Diagnosed from Mafia (read-only) on 2026-06-06. One code change is already staged. Deploy when ready.**

---

## The problem (proven)

- Google Ads has recorded **0 website conversions its entire life** (1 phone-call conversion, once, Apr 17).
- Real leads ARE arriving — GHL shows ~18 Google-sourced web leads in the last 30 days.
- So Google's automated bidding has been flying **completely blind** — it's on "Maximize Clicks" buying the *cheapest* clicks because it has zero lead data to optimize toward.

## The root cause (proven via the Google Ads API)

The Google Ads conversion action **"Request quote"** (ID `7527867027`) expects the event **`ads_conversion_Request_quote_1`**.

`src/pages/ThankYou.tsx:46` **already fires that exact event** ✅ — but it fires it into the **GA4 tag only** (`G-WT37C3RDXE`). `src/layouts/Layout.astro` had **no Google Ads tag** configured, so the event reached GA4 and Google Ads never saw it.

## The fix (STAGED — 1 line)

Already added to `src/layouts/Layout.astro`, right after the GA4 config:

```js
gtag('config', 'AW-17950162168');
```

(`17950162168` = this account's Google Ads conversion tracking ID, confirmed via API.) This wires the already-firing event to Google Ads. **Safe and additive** — it cannot affect GA4 or Meta, only adds the missing Ads destination.

### Deploy
1. Review the staged change in `src/layouts/Layout.astro`.
2. Commit + push (auto-deploys via Vercel).
3. Done. No other code change required for the online path.

### Verify (within 24–48h of a real form submit)
- **Live check:** open the site with the Google **Tag Assistant** Chrome extension → submit a test quote → confirm an `AW-17950162168` conversion fires on `/thank-you`.
- **Account check:** Google Ads → Goals → Conversions → "Request quote" status moves from *"No recent conversions"* to *"Recording conversions."*

---

## If conversions still show 0 after 48h (account-side backup path)

The "Request quote" action is type `GOOGLE_ANALYTICS_4_CUSTOM` (GA4-imported). If the one-liner alone doesn't register it, the account-side link needs completing — **no code change, ~3 min in the UI:**

**Option A — complete the GA4 import (preferred, matches current setup):**
1. GA4 (`G-WT37C3RDXE`) → Admin → Events → mark **`generate_lead`** as a **Key event**.
2. GA4 → Admin → Product links → **Google Ads links** → confirm account `179-501-6216` (or `1425999658`) is linked.
3. Google Ads → Goals → Conversions → **New → Import → GA4 → Web** → import `generate_lead`.

**Option B — bulletproof native action (fully code-controlled):**
1. Google Ads → Goals → Conversions → **New conversion action → Website** → name it "Website Lead" → it generates `AW-17950162168/<LABEL>`.
2. Send me the `<LABEL>` and I'll wire `ThankYou.tsx` to fire `gtag('event','conversion',{ send_to:'AW-17950162168/<LABEL>', value: <quote>, currency:'CAD' })` — which also feeds **lead value** for value-based bidding.

---

## After tracking is confirmed live (the actual optimization)

1. **Switch bidding** Target Spend → **Maximize Conversions** once ~15–30 conversions accumulate (~1–2 weeks). This is the real win — same $50/day, Google starts buying lead-shaped clicks. Expect +30–60% leads per dollar.
2. **Daypart on real data** — we held the overnight trim deliberately (see note in the session). With conversion data we'll see which hours actually book and cut the dead ones with proof.

---

## Phase 2 — close the whole loop (click → booked → PAID)

Right now even the fixed tracking only counts the **form fill**, not the booked job. To optimize Google toward *paying customers* (Elliott's instinct, and best practice):

1. **Capture `gclid`** on landing into a GHL field. The main quote form (`SKUCalculator.tsx`) currently passes only `landing_page` — add `gclid` / `fbclid` from the URL into the `/api/lead` payload and store it as a GHL custom field. *(Not yet staged — needs a GHL custom-field ID created first.)*
2. **Offline Conversion Import:** an n8n job uploads **won/booked** GHL opportunities back to Google via the existing `Request quote (offline)` action (ID `7592419841`) using the stored `gclid` + booked value. Google then optimizes for real revenue, not form-fills.

---

## What was already executed in the ad account (2026-06-06, live)

- **Meta:** all campaigns paused (`TRY — Launch — 2026-05-W19` was the only live one — 1 lead / $1,045 in 30d). ~$1,045/mo saved.
- **Google:** 38 campaign-level negative keywords added (wrong-service: carpet/window/duct/oven/pressure-washing/etc.; job-seeker: jobs/hiring/resume/how-to; competitor brands: molly maid/merry maids/servicemaster/etc.).
- **Held deliberately:** overnight ad-schedule trim — midnight is actually the 2nd-highest-traffic hour, and forcing an ad schedule is all-or-nothing risk during a critical month. Better to daypart on real conversion data in ~2 weeks.
