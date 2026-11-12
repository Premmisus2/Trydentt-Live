// Trydentt Cleaning site generator. One data file (site/data.json) in, static HTML out (dist/).
// Run with `npm run build`. Vercel serves dist/ and compiles api/lead.ts into a function.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'site/data.json'), 'utf8'));

/* ---------------- claims and dashes (Google recovery checklist, 2026-11-11) ---------------- */
const SCRUB = [
  [/We use only EPA-certified, plant-based/g, 'We use plant-based'],
  [/EPA-certified, plant-based/g, 'plant-based'],
  [/Plant-based, EPA-certified products/g, 'Plant-based products'],
  [/\s*Our team uses HEPA filtration to ensure the air is as clean as the surfaces\./g, ''],
  [/an instant, AI-powered cleaning estimate/gi, 'an instant cleaning estimate'],
  [/a precise, AI-powered estimate/g, 'a quick estimate'],
  [/Instant AI-powered quotes/g, 'Instant quotes'],
  [/an instant AI-powered estimate/g, 'an instant estimate'],
  [/Our AI-powered estimator/g, 'Our estimator'],
  [/AI-powered /g, ''],
  [/Fully insured \+ bonded team/g, 'Fully insured team'],
  [/Fully Insured & Bonded/g, 'Fully Insured'],
  [/Insured & Bonded/g, 'Fully Insured'],
  [/Insured · Bonded · /g, 'Insured · '],
  [/Bonded and insured\./g, 'Fully insured.'],
  [/([Ff])ully insured and bonded/g, '$1ully insured'],
  [/Insured and bonded/g, 'Fully insured'],
  [/insured and bonded/g, 'insured'],
  [/Join (hundreds of|families across)[^.!]*[.!]\s*/g, ''],
  [/,?\s*Over 30 years of combined experience,?/g, ','],
  [/,\s*30\+ years combined experience/g, ''],
  [/\s*Trusted by families & businesses across [^.]+\.\s*/g, ''],
  // Calls from the site ring the Cleaning tracking line, which forwards to 519 (2026-11-12).
  // Only shown numbers and tel: links move; the schema telephone stays 519 to match Google.
  [/\(519\) 871-3368/g, '(548) 761-7171'],
  [/\+1 519-871-3368/g, '+1 548-761-7171'],
  [/tel:\+15198713368/g, 'tel:+15487617171'],
  [/\u2014|\u2013/g, ', '],
  [/,\s*,/g, ','],
  [/^,\s*/g, ''],
];
const DROP_BLOCK = [/^Over 30 years/, /^Trusted by families/, /^Join (hundreds|families)/];
function scrub(s) { let t = String(s).replace(/\bSt\. /g, 'St\u0001 '); for (const [re, to] of SCRUB) t = t.replace(re, to); return t.replace(/\u0001/g, '.').replace(/\s{2,}/g, ' ').trim(); }
function deep(v) {
  if (typeof v === 'string') return scrub(v);
  if (Array.isArray(v)) return v.map(deep);
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = deep(v[k]); return o; }
  return v;
}
const D = deep(raw);
const SITE = D.site;
const ORIGIN = SITE.origin;
const PHONE = '(548) 761-7171', TEL = 'tel:+15487617171';
const FB = 'https://www.facebook.com/914427345076805';
const IG = 'https://www.instagram.com/trydenttcleaning';
const LI = 'https://www.linkedin.com/company/trydentt';

/* Hours are 24 (decided 2026-11-05): homes by day, businesses overnight. */
const HOURS = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }];
const GLOBAL_LD = (D.shared.globalJsonLd || []).map((b) => {
  const o = JSON.parse(JSON.stringify(b));
  if (o['@type'] === 'CleaningService') {
    o.openingHoursSpecification = HOURS;
    o.telephone = '+15198713368'; // stays 519: matches the Google Business Profile
    o.sameAs = [FB, IG, LI];
    if (o.description) o.description = scrub(o.description);
  }
  return o;
});

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SMALL = new Set(['by', 'and', 'to', 'for', 'in', 'of', 'your', 'the', 'is', 'with', 'every', 'you', 'on', 'or', 'at', 'our']);
// Headlines are plain text (2026-11-12): the auto-picked accent word was the Schnitzelhaus italic
// trick, and in Jost it only showed as a random blue word ("House cleaning in London").
function accent(text) {
  return esc(text);
}
/* A tick-list item; items written "✕ ..." (the competitor column) get a cross instead of a tick. */
const tickLi = (t) => /^✕\s*/.test(t) ? `<li class="no">${esc(t.replace(/^✕\s*/, ''))}</li>` : `<li>${esc(t)}</li>`;
const shield = (fill = '#3264B9') => `<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M64 64H448V344C448 396 384 448 256 448C128 448 64 396 64 344V64Z" fill="${fill}"/><rect x="112" y="112" width="64" height="200" fill="#fff"/><rect x="224" y="112" width="64" height="280" fill="#fff"/><rect x="336" y="112" width="64" height="200" fill="#fff"/></svg>`;
const brand = (dark) => `<a class="brand" href="/" aria-label="Trydentt Cleaning Services, home">${shield()}<span><b${dark ? ' style="color:#fff"' : ''}>TRYDENTT</b><small>CLEANING SERVICES</small></span></a>`;
const asset = (name) => {
  const p = path.join(ROOT, 'site/assets', name);
  const h = crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
  return `/assets/${name}?v=${h}`;
};

/* ---------------- head ---------------- */
const OWN_META = {
  '/privacy-policy': { title: 'Privacy Policy | Trydentt Cleaning Services', description: 'How Trydentt Cleaning Services collects, uses and protects the information you share with us through this website, our forms and our phone line.' },
  '/terms': { title: 'Terms of Service | Trydentt Cleaning Services', description: 'The terms that apply when you use the Trydentt Cleaning Services website, request a quote or book a clean in London, Ontario and area.' },
  '/404': { title: 'Page Not Found | Trydentt Cleaning Services', description: 'That page does not exist. Find Trydentt Cleaning Services in London, Ontario, or call (548) 761-7171.' },
};
function head(route, r) {
  const own = OWN_META[route];
  const title = own ? own.title : r.title;
  const desc = own ? own.description : r.description;
  const canonical = route === '/404' ? null : (own ? ORIGIN + route : r.canonical);
  const robots = route === '/404' ? 'noindex' : (r.robots || 'index, follow');
  const og = Object.assign({}, r.og || {});
  if (own) { og['og:title'] = title; og['og:description'] = desc; og['og:url'] = canonical || ORIGIN + '/'; }
  const ogTags = Object.entries(og).map(([k, v]) => k.startsWith('twitter:')
    ? `<meta name="${esc(k)}" content="${esc(v)}">`
    : `<meta property="${esc(k)}" content="${esc(v)}">`).join('\n');
  const ld = [...GLOBAL_LD, ...(route === '/404' ? [] : (r.jsonld || []))]
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`).join('\n');
  const tr = SITE.tracking;
  return `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${esc(robots)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">\n<link rel="alternate" hreflang="en-ca" href="${esc(canonical)}">\n<link rel="alternate" hreflang="x-default" href="${esc(canonical)}">` : ''}
${ogTags}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/favicon.svg">
<meta name="theme-color" content="#3264B9">
<meta name="format-detection" content="telephone=no">
<meta name="google-site-verification" content="GotGUwJf1n_Dm0MXkrkad1NfVbcVwaVK5kyXCDJgSIU">
<meta name="facebook-domain-verification" content="g4gqjpw074c9snuxxszvn1ndub6afc">
<meta name="facebook-domain-verification" content="g6l2jl8rbm0o8u8tuwvn2532mh6p">
<meta name="geo.region" content="CA-ON">
<meta name="geo.placename" content="London">
<meta name="geo.position" content="42.9849;-81.2453">
<meta name="ICBM" content="42.9849, -81.2453">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset('site.css')}">
${ld}
<script async src="https://www.googletagmanager.com/gtag/js?id=${tr.ga4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tr.ga4}');gtag('config','${tr.googleAds}');</script>
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tr.metaPixel}');fbq('track','PageView');</script>
</head>`;
}

/* ---------------- shared chrome ---------------- */
const NAV = D.nav;
function header() {
  const res = NAV.residentialMenu.map((m) => `<a href="${m.path}">${esc(m.name)}${m.tagline ? `<span>${esc(m.tagline)}</span>` : ''}</a>`).join('');
  const areas = NAV.areasMenu.map((m) => `<a href="${m.path}">${esc(m.name)}</a>`).join('');
  return `<div class="ribbon">Homes by day &middot; Offices overnight &middot; London, Ontario and area</div>
<header class="top">
  <div class="wrap">
    ${brand(false)}
    <nav class="main" aria-label="Main">
      <div class="dd"><button type="button" aria-haspopup="true">Residential</button><div class="menu">${res}</div></div>
      <a href="/commercial">Commercial</a>
      <div class="dd"><button type="button" aria-haspopup="true">Areas</button><div class="menu">${areas}</div></div>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
    <div class="hcta"><a class="tel" href="${TEL}">${PHONE}</a><a class="btn" href="/quote">Get a price</a><button class="menubtn" type="button" aria-label="Open menu"><i></i><i></i><i></i></button></div>
  </div>
</header>
<div class="mnav" role="dialog" aria-label="Menu">
  <div class="x">${brand(true)}<button type="button">Close</button></div>
  <a href="/">Home</a>
  <h4>Residential</h4>${res}
  <h4>Business</h4><a href="/commercial">Commercial cleaning</a>
  <h4>Areas</h4>${areas}
  <h4>Trydentt</h4><a href="/about">About</a><a href="/contact">Contact</a><a href="/quote">Get a price</a><a href="${TEL}">Call ${PHONE}</a>
</div>`;
}
function footer() {
  const towns = NAV.areasMenu.map((m) => `<li><a href="${m.path}">${esc(m.name)}</a></li>`).join('');
  return `<footer class="foot">
  <div class="wrap">
    <div class="cols">
      <div>${brand(true)}<p style="margin-top:16px">Trydentt Building Services. Cleaning homes and businesses in London, Ontario and the towns around it.</p>
        <p style="margin-top:10px"><a href="${TEL}">${PHONE}</a><br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <div class="follow"><h4>Follow us</h4><div class="social">
          <a class="fb" href="${FB}" aria-label="Trydentt on Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a class="ig" href="${IG}" aria-label="Trydentt on Instagram"><svg viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
          <a class="li" href="${LI}" aria-label="Trydentt on LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>
        </div></div>
      </div>
      <div><h4>Homes</h4><ul><li><a href="/residential">House cleaning</a></li><li><a href="/residential">Deep cleaning</a></li><li><a href="/move-out">Move-in and move-out</a></li><li><a href="/residential">Post-construction</a></li><li><a href="/friday-reset">Friday Reset</a></li><li><a href="/reset">Bi-weekly Reset</a></li></ul></div>
      <div><h4>Businesses</h4><ul><li><a href="/commercial">Commercial cleaning</a></li><li><a href="/commercial">Office cleaning</a></li><li><a href="/commercial">Janitorial</a></li><li><a href="/commercial#audit-form">Free 12-Point Audit</a></li></ul></div>
      <div><h4>Areas</h4><ul>${towns}</ul></div>
      <div><h4>Company</h4><ul><li><a href="/about">About us</a></li><li><a href="/contact">Contact</a></li><li><a href="/quote">Book online</a></li><li><a href="/privacy-policy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li></ul></div>
    </div>
    <div class="legal"><span>&copy; 2026 Trydentt Building Services. All rights reserved.</span><a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms of Service</a></div>
  </div>
</footer>
<div class="callbar"><a href="${TEL}">Call</a><a href="/quote">Get a price</a></div>`;
}
function page(route, r, body, opts = {}) {
  const calc = opts.calc ? `<script>window.TC_CALC=${JSON.stringify({ niches: D.calculator.niches, floors: D.calculator.floors })};</script>` : '';
  return `${head(route, r)}
<body data-route="${route}">
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${SITE.tracking.metaPixel}&ev=PageView&noscript=1"></noscript>
${header()}
<main id="top">
${body}
</main>
${footer()}
${calc}<script src="${asset('site.js')}" defer></script>
</body>
</html>
`;
}

/* ---------------- components ---------------- */
function calcBox(id = 'price') {
  return `<div class="calc" id="${id}-calc">
  <div class="seg" role="group" aria-label="Home or business"><button type="button" class="on" data-n="residential">Home</button><button type="button" data-n="commercial">Business</button></div>
  <label for="${id}-svc">Kind of clean</label>
  <select id="${id}-svc"></select>
  <label for="${id}-sq">Size of the space</label>
  <input id="${id}-sq" type="range" min="${D.calculator.slider.min}" max="${D.calculator.slider.max}" step="${D.calculator.slider.step}" value="${D.calculator.slider.default}">
  <div class="size"><span>500 sq ft</span><b class="sqv">1,500 sq ft</b><span>10,000+</span></div>
  <div class="est"><div class="n">$202 to $248</div><small>An estimate, not a quote. Final price confirmed with you first.</small></div>
  <div class="btns"><a class="btn" href="/quote" data-lock>Lock in this price</a></div>
</div>`;
}
const field = (name, label, input, extra = '') => `<div class="f" data-f="${name}"><label for="f-${name}">${esc(label)}</label>${input}<span class="err" role="alert"></span>${extra}</div>`;
const inp = (name, type = 'text', ph = '', more = '') => `<input id="f-${name}" name="${name}" type="${type}"${ph ? ` placeholder="${esc(ph)}"` : ''}${more}>`;
function heroForm(route) {
  const H = D.forms.heroLeadForm;
  const cfg = H.usedOn[route] === 'defaults' ? H.defaults : Object.assign({}, H.defaults, H.usedOn[route]);
  return `<div class="formcard" id="form">
  <div class="kick">${esc(cfg.badge)}</div>
  <h2>${accent(cfg.heading)}</h2>
  <p class="sub">${esc(cfg.subheading)}</p>
  <form class="form" data-form="hero" data-source="${esc(cfg.source)}" data-niche="${esc(cfg.niche || 'residential')}"${cfg.sku ? ` data-sku="${esc(cfg.sku)}"` : ''} novalidate>
    ${field('name', 'Full name', inp('name', 'text', 'Jane Smith', ' autocomplete="name" required'))}
    ${field('phone', 'Phone number', `<div class="pre"><span>+1</span>${inp('phone', 'tel', '519-555-5555', ' autocomplete="tel-national" required')}</div>`)}
    ${field('postalCode', 'Postal code', inp('postalCode', 'text', 'N6A 1A1', ' autocomplete="postal-code" style="text-transform:uppercase" required'))}
    <div class="fail" role="alert"></div>
    <button class="btn" type="submit" data-busy="${esc(H.busyLabel)}">${esc(cfg.ctaLabel)}</button>
  </form>
  <div class="trust">${H.trustLine.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
  <p class="call">Or call <a href="${TEL}">${PHONE}</a></p>
</div>`;
}
function contactForm() {
  const C = D.forms.contact;
  const opts = C.fields.find((f) => f.name === 'type').options.map((o) => `<option>${esc(o)}</option>`).join('');
  return `<form class="form" data-form="contact" novalidate>
  <div class="two">${field('name', 'Full name', inp('name', 'text', 'John Doe', ' autocomplete="name" required'))}${field('email', 'Email address', inp('email', 'email', 'john@example.com', ' autocomplete="email" required'))}</div>
  <div class="two">${field('phone', 'Phone (optional)', inp('phone', 'tel', '(519) 555-0123', ' autocomplete="tel"'))}${field('zip', 'Postal code', inp('zip', 'text', 'N6A 1A1', ' autocomplete="postal-code" required'))}</div>
  ${field('type', 'Type of cleaning', `<select id="f-type" name="type">${opts}</select>`)}
  ${field('message', 'Additional details (optional)', `<textarea id="f-message" name="message" placeholder="Tell us more about your needs..."></textarea>`)}
  <div class="fail" role="alert"></div>
  <button class="btn" type="submit" data-busy="${esc(C.busyLabel)}">${esc(C.button)}</button>
</form>`;
}
function commercialForm() {
  const C = D.forms.commercialAudit;
  const sel = (n) => { const f = C.fields.find((x) => x.name === n); return `<select id="f-${n}" name="${n}">${f.options.map((o) => `<option${o === f.default ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`; };
  return `<form class="form" data-form="commercial" novalidate>
  <div class="two">${field('businessName', 'Business name *', inp('businessName', 'text', '', ' autocomplete="organization"'))}${field('role', 'Your role', inp('role', 'text', 'Office mgr, owner, GM'))}</div>
  <div class="two">${field('contactName', 'Contact name *', inp('contactName', 'text', '', ' autocomplete="name"'))}${field('phone', 'Phone *', inp('phone', 'tel', '', ' autocomplete="tel"'))}</div>
  <div class="two">${field('email', 'Email', inp('email', 'email', '', ' autocomplete="email"'))}${field('sqft', 'Approx. sq ft', inp('sqft', 'text', 'e.g. 3000'))}</div>
  <div class="two">${field('buildingType', 'Building type', sel('buildingType'))}${field('frequency', 'Desired frequency', sel('frequency'))}</div>
  <div class="two">${field('currentCleaner', 'Current cleaning setup', sel('currentCleaner'))}${field('preferredAuditDate', 'Preferred audit date', inp('preferredAuditDate', 'date'))}</div>
  <p class="cmsg err" style="display:block" hidden></p>
  <div class="fail" role="alert"></div>
  <button class="btn" type="submit" data-busy="Submitting...">${esc(C.button)}</button>
  <p class="small">No payment. No contract. We walk your floor and quote within 24 hours.</p>
</form>`;
}
function callbackForm() {
  const towns = ['London', 'St. Thomas', 'Strathroy', 'Woodstock', 'Ingersoll', 'Tillsonburg', 'Aylmer', 'Dorchester', 'Somewhere else'];
  return `<form class="form" data-form="callback" novalidate>
  <div class="two">${field('name', 'Your name', inp('name', 'text', '', ' autocomplete="name"'))}${field('phone', 'Phone number', inp('phone', 'tel', '519-555-5555', ' autocomplete="tel-national"'))}</div>
  <div class="two">${field('kind', 'Home or business', `<select id="f-kind" name="kind"><option>Home</option><option>Business</option></select>`)}${field('city', 'Town', `<select id="f-city" name="city">${towns.map((t) => `<option>${t}</option>`).join('')}</select>`)}</div>
  ${field('message', 'What needs cleaning, and when?', `<textarea id="f-message" name="message"></textarea>`)}
  <div class="fail" role="alert"></div>
  <button class="btn" type="submit" data-busy="Sending...">Send</button>
  <p class="small">This goes straight to our phone. If it doesn't send, you'll see a message saying so. Call <b>${PHONE}</b>.</p>
</form>`;
}
function faqHtml(items) {
  return `<div class="faq">${items.map((q) => `<details><summary>${esc(q.q)}</summary><p>${esc(q.a)}</p></details>`).join('')}</div>`;
}
function faqFromLd(r) {
  const f = (r.jsonld || []).find((b) => b['@type'] === 'FAQPage');
  return f ? f.mainEntity.map((m) => ({ q: m.name, a: m.acceptedAnswer.text })) : [];
}

/* ---------------- generic section renderer ---------------- */
const PRICE = /^\$[\d,.]+\+?( to \$[\d,.]+\+?)?$|^incl\.$/i; // "$150", "$489+", "$200 to $275"
const isFormBlock = (b) => ['field', 'label'].includes(b.t) || (b.t === 'text' && /^🇨🇦/.test(b.text));
function renderBlocks(blocks, ctx) {
  const out = [];
  let i = 0, kicked = false;
  const btns = [];
  const flushBtns = () => { if (btns.length) { out.push(`<div class="btns">${btns.splice(0).join('')}</div>`); } };
  const linkBtn = (b, first) => {
    let href = b.href || '#';
    if (href === '#top') href = ctx.hasForm ? '#form' : '/quote';
    const cls = first ? 'btn' : 'btn line';
    return `<a class="${cls}" href="${esc(href)}"${ctx.cta ? ctx.cta(b) : ''}>${esc(b.text)}</a>`;
  };
  while (i < blocks.length) {
    const b = blocks[i];
    if (DROP_BLOCK.some((re) => re.test(b.text || ''))) { i++; continue; }
    if (b.t === 'text' && !kicked && !out.length) { out.push(`<div class="kick">${esc(b.text)}</div>`); kicked = true; i++; continue; }
    if (b.t === 'h1') { flushBtns(); out.push(`<h1>${accent(b.text)}</h1>`); i++; continue; }
    if (b.t === 'h2') { flushBtns(); out.push(`<h2>${accent(b.text)}</h2>`); i++; continue; }
    if (b.t === 'summary') {
      const items = [];
      while (i < blocks.length && blocks[i].t === 'summary') {
        const q = blocks[i].text; let a = '';
        if (blocks[i + 1] && blocks[i + 1].t === 'text') { a = blocks[i + 1].text; i += 2; } else { const m = (ctx.faq || []).find((x) => x.q === q); a = m ? m.a : ''; i += 1; }
        items.push({ q, a });
      }
      out.push(faqHtml(items.filter((x) => x.a))); continue;
    }
    if (b.t === 'img') {
      const imgs = [];
      while (i < blocks.length && (blocks[i].t === 'img' || (blocks[i].t === 'text' && /^(before|after)$/i.test(blocks[i].text)) || (blocks[i].t === 'field' && blocks[i].type === 'range'))) {
        if (blocks[i].t === 'img') imgs.push(blocks[i]); i++;
      }
      const before = imgs.find((x) => /before/i.test(x.src + x.alt)) || imgs[0];
      const after = imgs.find((x) => /after/i.test(x.src + x.alt) && x !== before) || imgs[1];
      if (before && after) out.push(`<div class="ba"><div class="ph"><span class="lab">BEFORE</span><img src="${esc(before.src)}" alt="${esc(before.alt)}" loading="lazy"></div><div class="ph after"><span class="lab">AFTER</span><img src="${esc(after.src)}" alt="${esc(after.alt)}" loading="lazy"></div></div><p class="cap">Real photos from a Trydentt job.</p>`);
      else imgs.forEach((x) => out.push(`<div class="ph" style="margin-top:20px"><img src="${esc(x.src)}" alt="${esc(x.alt)}" loading="lazy"></div>`));
      continue;
    }
    if (b.t === 'li') {
      const lis = [];
      const list = b.list;
      while (i < blocks.length && blocks[i].t === 'li' && blocks[i].list === list) { lis.push(blocks[i].text); i++; }
      out.push(`<ul class="ticks">${lis.map(tickLi).join('')}</ul>`); continue;
    }
    if (b.t === 'h3' || (b.t === 'p' && blocks[i + 1] && blocks[i + 1].t === 'h3' && b.text.length < 40)) {
      flushBtns();
      const items = [];
      while (i < blocks.length && (blocks[i].t === 'h3' || (blocks[i].t === 'p' && blocks[i + 1] && blocks[i + 1].t === 'h3' && blocks[i].text.length < 40))) {
        const it = { kick: '', h: '', parts: [] };
        if (blocks[i].t === 'p') { it.kick = blocks[i].text; i++; }
        it.h = blocks[i].text; i++;
        let firstP = true;
        while (i < blocks.length && !['h3', 'h2', 'h1', 'summary', 'img'].includes(blocks[i].t)) {
          const c = blocks[i];
          if (c.t === 'p' && blocks[i + 1] && blocks[i + 1].t === 'h3' && c.text.length < 40 && it.parts.length) break;
          if (DROP_BLOCK.some((re) => re.test(c.text || ''))) { i++; continue; }
          if (c.t === 'p' && !c.text) { i++; continue; }
          if (c.t === 'p' && /^Or call/i.test(c.text)) { it.parts.push(`<p class="note">Or call <a href="${TEL}"><b>${PHONE}</b></a></p>`); i++; continue; }
          if (c.t === 'p') { const big = firstP && /^\$/.test(c.text); it.parts.push(`<p${big ? ' class="big"' : ''}>${esc(c.text)}</p>`); firstP = false; i++; }
          else if (c.t === 'li') { const lis = []; const l = c.list; while (i < blocks.length && blocks[i].t === 'li' && blocks[i].list === l) { lis.push(blocks[i].text); i++; } it.parts.push(`<ul class="ticks">${lis.map(tickLi).join('')}</ul>`); }
          else if (c.t === 'a') { it.parts.push(`<div class="btns">${linkBtn(c, true)}</div>`); i++; }
          else if (c.t === 'text') { it.parts.push(`<p class="note">${esc(c.text)}</p>`); i++; }
          else i++;
        }
        items.push(it);
      }
      const n = items.length;
      out.push(`<div class="items${n === 2 ? ' n2' : n === 4 ? ' n4' : ''}">${items.map((it) => `<div class="item">${it.kick ? `<div class="ik">${esc(it.kick)}</div>` : ''}<h3>${esc(it.h)}</h3>${it.parts.join('')}</div>`).join('')}</div>`);
      continue;
    }
    if (b.t === 'text') {
      const run = [];
      while (i < blocks.length && blocks[i].t === 'text') { if (!DROP_BLOCK.some((re) => re.test(blocks[i].text))) run.push(blocks[i].text); i++; }
      if (run.some((t) => PRICE.test(t))) {
        const firstP = run.findIndex((t) => PRICE.test(t));
        const intro = run.slice(0, Math.max(0, firstP - 1));
        const rows = []; let j = firstP - 1;
        while (j < run.length) {
          if (j + 1 < run.length && PRICE.test(run[j + 1])) {
            const row = { label: run[j], price: run[j + 1], note: '' };
            if (j + 2 < run.length && !(j + 3 < run.length && PRICE.test(run[j + 3])) && !PRICE.test(run[j + 2])) {
              const nextIsLabel = j + 3 < run.length && PRICE.test(run[j + 3]);
              if (!nextIsLabel && j + 2 === run.length - 1) { row.note = ''; rows.push(row); j += 2; break; }
              row.note = run[j + 2]; j += 3;
            } else j += 2;
            rows.push(row);
          } else break;
        }
        const tail = run.slice(j);
        if (intro.length) out.push(`<div class="prices-intro"><b>${esc(intro[0])}</b>${intro.slice(1).map((t) => `<p>${esc(t)}</p>`).join('')}</div>`);
        out.push(`<div class="prices">${rows.map((r) => `<div class="row"><b>${esc(r.label)}</b><strong>${esc(r.price)}</strong>${r.note ? `<span>${esc(r.note)}</span>` : ''}</div>`).join('')}</div>`);
        tail.forEach((t) => out.push(`<p class="note">${esc(t)}</p>`));
      } else if (run.length === 1) {
        out.push(/^Or call/i.test(run[0]) ? `<p class="note">Or call <a href="${TEL}"><b>${PHONE}</b></a></p>` : `<p class="note">${esc(run[0])}</p>`);
      } else {
        out.push(`<div class="tags">${run.map((t) => `<span>${esc(t)}</span>`).join('')}</div>`);
      }
      continue;
    }
    if (b.t === 'p') {
      if (!b.text) { i++; continue; }
      if (/^Or call/i.test(b.text)) { out.push(`<p class="note">Or call <a href="${TEL}"><b>${PHONE}</b></a></p>`); i++; continue; }
      out.push(`<p class="lead">${esc(b.text)}</p>`); i++; continue;
    }
    if (b.t === 'a') {
      const run = [];
      while (i < blocks.length && blocks[i].t === 'a') { run.push(blocks[i]); i++; }
      const towns = run.filter((x) => /-cleaning$/.test(x.href || ''));
      if (towns.length >= 4) out.push(`<div class="tags">${run.map((x) => `<a href="${esc(x.href)}">${esc(x.text)} <span>&rarr;</span></a>`).join('')}</div>`);
      else run.forEach((x, k) => btns.push(linkBtn(x, btns.length === 0 && k === 0)));
      continue;
    }
    i++;
  }
  flushBtns();
  return out.join('\n');
}
function sectionsOf(r) {
  const by = new Map();
  for (const b of r.main.blocks) { const s = b.s; if (!by.has(s)) by.set(s, []); by.get(s).push(b); }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([s, blocks]) => ({ s, id: (r.main.sections.find((x) => x.i === s) || {}).id || '', blocks }));
}
const isCalc = (blocks) => blocks.some((b) => b.t === 'button' && /Lock in this Price/i.test(b.text)) || blocks.some((b) => b.t === 'label' && /Choose Your Space/i.test(b.text));
const isCta = (blocks) => blocks.some((b) => b.t === 'h2' && /^(Ready|Get started|Book|Start)/i.test(b.text));

function bodySections(route, r, list, opts = {}) {
  let tone = 0;
  return list.map((sec) => {
    const blocks = sec.blocks.filter((b) => !isFormBlock(b) && b.t !== 'button');
    if (isCalc(sec.blocks)) {
      return `<section class="sec alt" id="price"><div class="wrap calc-wrap"><div><div class="kick">Price in 30 seconds</div><h2>What will it <em>cost</em>?</h2><p>Pick home or business, the kind of clean, and the size of the space. The range is worked out from the square footage, and we confirm the final price with you before we start.</p></div>${calcBox('s' + sec.s)}</div></section>`;
    }
    const dark = isCta(sec.blocks);
    const cls = dark ? 'sec dark' : (tone++ % 2 ? 'sec alt' : 'sec');
    const inner = renderBlocks(blocks, { hasForm: opts.hasForm, faq: opts.faq, cta: opts.cta });
    const extra = opts.extra && opts.extra[sec.s] ? opts.extra[sec.s] : '';
    return `<section class="${cls}"${sec.id ? ` id="${sec.id}"` : ''}><div class="wrap">${inner}${extra}</div></section>`;
  }).join('\n');
}

/* ---------------- page types ---------------- */
const HERO_IMG = {
  '/residential': '/images/hero-friday.jpg', '/commercial': '/images/hero-classa.jpg', '/move-out': '/images/hero-moveout.jpg',
  '/reset': '/images/hero-biweekly.jpg', '/friday-reset': '/images/hero-friday.jpg', '/about': '/images/about-team.jpg',
  '/london-ontario-cleaning': '/images/about-team.jpg', '/london-ontario-cleaning-offer': '/images/about-team.jpg',
};
function heroSection(route, blocks, { img, form, ctaAttr } = {}) {
  const b = blocks.filter((x) => !isFormBlock(x) && x.t !== 'button');
  let kicker = '', h1 = '', ps = [], lis = [], facts = [], links = [];
  let formTexts = [];
  if (form) {
    const H = D.forms.heroLeadForm;
    const cfg = H.usedOn[route] === 'defaults' ? H.defaults : Object.assign({}, H.defaults, H.usedOn[route]);
    formTexts = [cfg.badge, cfg.heading, cfg.subheading, ...H.trustLine].map((t) => scrub(t).toLowerCase());
  }
  let seenH1 = false;
  for (const x of b) {
    if (DROP_BLOCK.some((re) => re.test(x.text || ''))) continue;
    if (formTexts.includes(String(x.text || '').toLowerCase())) continue;
    if (x.t === 'text' && !kicker && !seenH1) kicker = x.text;
    else if (x.t === 'h1') { h1 = x.text; seenH1 = true; }
    else if (x.t === 'p' && /^Or call/i.test(x.text)) continue;
    else if (x.t === 'p') ps.push(x.text);
    else if (x.t === 'li') lis.push(x.text);
    else if (x.t === 'text') facts.push(x.text);
    else if (x.t === 'a') links.push(x);
    else if (x.t === 'h2' || x.t === 'h3') ps.push(x.text);
  }
  const h1fix = h1.replace(/([a-z])(passes|Reclaim)/, '$1 $2');
  const btns = links.length ? `<div class="btns">${links.map((l, k) => `<a class="btn${k ? ' line' : ''}" href="${esc(l.href === '#top' ? '#form' : l.href)}"${ctaAttr && k === 0 ? ctaAttr : ''}>${esc(l.text)}</a>`).join('')}</div>`
    : `<div class="btns">${form ? `<a class="btn" href="#form">Get my quote</a>` : `<a class="btn" href="/quote">Get your price</a>`}<a class="btn line" href="${TEL}">Call ${PHONE}</a></div>`;
  const copy = `<div class="copy">
      ${kicker ? `<div class="eyebrow">${esc(kicker)}</div>` : ''}
      <h1>${accent(h1fix)}</h1>
      <div class="bar"></div>
      ${ps.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${lis.length ? `<ul class="ticks">${lis.map(tickLi).join('')}</ul>` : ''}
      ${facts.length ? `<div class="facts">${facts.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
      ${form ? '' : btns}
    </div>`;
  return `<div class="hero${form ? ' form' : ' short'}">
  ${img ? `<div class="bg"><img src="${img}" alt="" fetchpriority="high"></div>` : ''}
  <div class="wrap">
    ${copy}
    ${form ? heroForm(route) : ''}
  </div>
</div>`;
}

function homePage() {
  const r = D.routes['/'];
  const faq = faqFromLd(r);
  const body = `<div class="hero">
  <div class="bg ph"><img src="/images/about-team.jpg" alt="A Trydentt cleaner wiping down a door frame" fetchpriority="high"><span class="real">Real photo &middot; our crew</span></div>
  <div class="wrap">
    <div class="copy">
      <div class="eyebrow">London, Ontario &middot; Canadian-owned</div>
      <h1>London's cleaners, <em>day</em> and night</h1>
      <div class="bar"></div>
      <p>Homes during the day. Offices, shops and restaurants overnight, after you close. Fully insured, based in London, and one phone call away.</p>
      <div class="btns"><a class="btn" href="#price" data-cta="hero_get_quote" data-page="home">Get your price</a><a class="btn line" href="${TEL}">Call ${PHONE}</a></div>
      <div class="proof">
        <div><b>Open 24 hrs</b><span>Day crews and night crews</span></div>
        <div><b>30 sec</b><span>To a price, no phone call</span></div>
        <div><b>8 towns</b><span>London and the area around it</span></div>
      </div>
    </div>
  </div>
</div>
<div class="ticker" aria-hidden="true"><div>${[1, 2].map(() => ['House cleaning', 'Deep cleans', 'Move-in and move-out', 'Post-construction', 'Offices', 'Janitorial', 'Retail stores', 'Windows and glass'].map((t) => `<span>${t}</span><i>&middot;</i>`).join('')).join('')}</div></div>
<section class="sec">
  <div class="wrap split">
    <div class="ph"><img src="/images/hero-friday.jpg" alt="A clean, bright kitchen" loading="lazy"></div>
    <div>
      <div class="kick">Residential &middot; London and area</div>
      <h2>Homes <em>by</em> day</h2>
      <p>Weekly, every two weeks, or once before company comes. You pick the clean, see the price before anyone shows up, and come home to it done.</p>
      <ul class="ticks"><li>General house cleaning</li><li>Deep cleaning</li><li>Move-in and move-out</li><li>Post-construction</li><li>Seasonal cleaning</li></ul>
      <div class="btns"><a class="btn" href="/residential">Home cleaning</a><a class="btn line" href="/move-out">Moving out?</a></div>
    </div>
  </div>
</section>
<section class="sec dark">
  <div class="wrap split flip">
    <div class="ph"><img src="/images/hero-classa.jpg" alt="A clean open-plan office at dusk" loading="lazy"></div>
    <div>
      <div class="kick">Commercial &middot; overnight crews</div>
      <h2>Offices <em>after</em> hours</h2>
      <p>Our commercial teams come in after you close, so your staff walk into a clean office in the morning and nobody works around a mop.</p>
      <ul class="ticks"><li>Office cleaning</li><li>Janitorial services</li><li>Retail stores</li><li>Post-event cleaning</li><li>Windows and glass</li><li>Carpet and upholstery</li></ul>
      <div class="btns"><a class="btn" href="/commercial">Commercial cleaning</a></div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="kick">Real jobs &middot; real photos</div>
    <h2>Before <em>and</em> after</h2>
    <div class="ba-grid">
      <div><div class="ba"><div class="ph"><span class="lab">BEFORE</span><img src="/images/commercial-before.jpg" alt="Restaurant washroom before cleaning" loading="lazy"></div><div class="ph after"><span class="lab">AFTER</span><img src="/images/commercial-after.jpg" alt="Restaurant washroom after cleaning" loading="lazy"></div></div><p class="cap">A restaurant washroom after a busy night. Straight from the job, no filters.</p></div>
      <div><div class="ba"><div class="ph"><span class="lab">BEFORE</span><img src="/images/home-before.jpg" alt="Window sill with water stains before cleaning" loading="lazy"></div><div class="ph after"><span class="lab">AFTER</span><img class="bot" src="/images/home-after.jpg" alt="Window sill after cleaning" loading="lazy"></div></div><p class="cap">Water-stained window sills, cleaned back to white.</p></div>
    </div>
  </div>
</section>
<section class="sec alt" id="price">
  <div class="wrap calc-wrap">
    <div><div class="kick">Price in 30 seconds</div><h2>What will it <em>cost</em>?</h2><p>Pick home or business, the kind of clean, and the size of the space. The range is worked out from the square footage, and we confirm the final price with you before we start.</p></div>
    ${calcBox('home').replace('data-lock>', 'data-lock data-cta="bottom_start_quote" data-page="home">')}
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="kick">Service area</div>
    <h2>We come <em>to</em> you</h2>
    <div class="tags">${NAV.areasMenu.map((m) => `<a href="${m.path}">${esc(m.name.replace(', ON', ''))} <span>&rarr;</span></a>`).join('')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    <div class="kick">Questions</div>
    <h2>Good <em>to</em> know</h2>
    ${faqHtml(faq)}
  </div>
</section>
<section class="sec dark" id="contact">
  <div class="wrap contact">
    <div><div class="kick">Get a call back</div><h2>Tell us <em>what</em> needs doing</h2>${callbackForm()}</div>
    <div>
      <div class="kick">Hours</div><h2>Open <em>24</em> hours</h2>
      <div class="hours">
        <div><b>Homes</b><span>Daytime visits</span></div>
        <div><b>Businesses</b><span>Overnight, after you close</span></div>
        <div><b>Phone</b><a href="${TEL}">${PHONE}</a></div>
        <div><b>Email</b><a href="mailto:${SITE.email}">${SITE.email}</a></div>
      </div>
    </div>
  </div>
</section>`;
  return page('/', r, body, { calc: true });
}

function genericPage(route, { form = false, calc = false, extra = {}, cta } = {}) {
  const r = D.routes[route];
  const secs = sectionsOf(r);
  const first = secs[0];
  const hero = heroSection(route, first.blocks, { img: HERO_IMG[route], form, ctaAttr: cta });
  const rest = bodySections(route, r, secs.slice(1), { hasForm: form, faq: faqFromLd(r), extra });
  return page(route, r, hero + '\n' + rest, { calc: calc || secs.some((s) => isCalc(s.blocks)) });
}

function townPage(t) {
  const r = D.routes[t.route];
  const secs = sectionsOf(r);
  const hero = heroSection(t.route, secs[0].blocks, { img: '/images/hero-biweekly.jpg' });
  const rest = bodySections(t.route, r, secs.slice(1), {});
  return page(t.route, r, hero + '\n' + rest);
}

function commercialPage() {
  const C = D.forms.commercialAudit;
  const r = D.routes['/commercial'];
  const secs = sectionsOf(r);
  const hero = heroSection('/commercial', secs[0].blocks, { img: HERO_IMG['/commercial'] });
  const formSec = `<section class="sec dark" id="audit-form"><div class="wrap contact"><div><div class="kick">Free 12-Point Audit</div><h2>${accent(C.heading)}</h2><p>${esc(C.sub)}</p></div><div>${commercialForm()}</div></div></section>`;
  const others = secs.slice(1).filter((s) => s.id !== 'audit-form');
  const before = bodySections('/commercial', r, others.filter((s) => s.s < 2));
  const after = bodySections('/commercial', r, others.filter((s) => s.s > 2));
  return page('/commercial', r, [hero, before, formSec, after].join('\n'));
}

function quotePage() {
  const r = D.routes['/quote'];
  const body = `<div class="hero short"><div class="bg"><img src="/images/hero-friday.jpg" alt=""></div><div class="wrap"><div class="copy">
  <div class="eyebrow">Instant estimate &middot; London, Ontario</div>
  <h1>Get your free <em>cleaning</em> estimate</h1>
  <div class="bar"></div>
  <p>Instant quotes for homes and businesses across London, Ontario. No phone calls required.</p>
</div></div></div>
<section class="sec step-calc" id="price"><div class="wrap calc-wrap"><div><div class="kick">Step 1 of 2</div><h2>Your price <em>in</em> seconds</h2><p>Choose home or business, the kind of clean and the size of the space. Then lock in the price and tell us where to come.</p><p class="note">The estimate is worked out from your square footage. Final pricing is confirmed with you before we start.</p></div>${calcBox('quote')}</div></section>
<section class="sec step-book" hidden><div class="wrap calc-wrap">
  <div><div class="kick">Step 2 of 2</div><h2>Complete <em>your</em> booking</h2>
    <div class="summary"><span class="kick">Your selected package</span><b></b><ul></ul></div>
    <p class="note"><a href="#" data-back>&larr; Change the clean or size</a></p>
  </div>
  <form class="form" data-form="booking" novalidate>
    ${field('name', 'Full name', inp('name', 'text', '', ' autocomplete="name"'))}
    <div class="two">${field('email', 'Email address', inp('email', 'email', '', ' autocomplete="email"'))}${field('phone', 'Phone number', `<div class="pre"><span>+1</span>${inp('phone', 'tel', '555-555-5555', ' autocomplete="tel-national"')}</div>`)}</div>
    ${field('address', 'Street address', inp('address', 'text', '', ' autocomplete="street-address"'))}
    <div class="two">${field('city', 'City', inp('city', 'text', '', ' autocomplete="address-level2"'))}${field('postalCode', 'Postal code', inp('postalCode', 'text', 'A1A 1A1', ' autocomplete="postal-code" style="text-transform:uppercase"'))}</div>
    <div class="fail" role="alert"></div>
    <button class="btn" type="submit" data-busy="Sending...">Confirm booking</button>
    <p class="small">We confirm the final price with you before we start. Nothing is charged online.</p>
  </form>
</div></section>
<section class="sec alt"><div class="wrap"><div class="kick">Questions</div><h2>About <em>the</em> estimate</h2>${faqHtml(faqFromLd(r))}</div></section>`;
  return page('/quote', r, body, { calc: true });
}

function contactPage() {
  const r = D.routes['/contact'];
  const body = `<div class="hero short"><div class="bg"><img src="/images/about-team.jpg" alt=""></div><div class="wrap"><div class="copy">
  <div class="eyebrow">Contact &middot; London, Ontario</div>
  <h1>Get in touch</h1><div class="bar"></div>
  <p>Questions, quotes or a clean you need soon. Send a message and we'll come back to you, or call us.</p>
</div></div></div>
<section class="sec"><div class="wrap contact">
  <div><div class="kick">Send a message</div><h2>Tell us <em>what</em> you need</h2>${contactForm()}</div>
  <div class="dark" style="padding:30px 26px;align-self:start"><div class="kick">Talk to us</div><h2 style="font-size:36px">Open <em>24</em> hours</h2>
    <div class="hours">
      <div><b>Phone</b><a href="${TEL}">${PHONE}</a></div>
      <div><b>Email</b><a href="mailto:${SITE.email}">${SITE.email}</a></div>
      <div><b>Homes</b><span>Daytime visits</span></div>
      <div><b>Businesses</b><span>Overnight, after you close</span></div>
      <div><b>Area</b><span>London, Ontario and 7 towns around it</span></div>
    </div>
  </div>
</div></section>`;
  return page('/contact', r, body);
}

function simplePage(route, { prose = false, noindexRoute } = {}) {
  const key = noindexRoute || route;
  const r = D.routes[key];
  const blocks = r.main.blocks;
  const h1 = (blocks.find((b) => b.t === 'h1') || {}).text || '';
  const rest = blocks.filter((b) => b.t !== 'h1');
  const inner = prose
    ? `<div class="prose">${rest.map((b) => b.t === 'h2' ? `<h2>${esc(b.text)}</h2>` : b.t === 'li' ? `<ul><li>${esc(b.text)}</li></ul>` : `<p>${esc(b.text)}</p>`).join('\n').replace(/<\/ul>\n<ul>/g, '')}</div>`
    : renderBlocks(rest, {});
  const body = `<div class="hero short"><div class="wrap" style="padding-top:110px"><div class="copy"><div class="eyebrow">Trydentt Cleaning Services</div><h1>${accent(h1)}</h1><div class="bar"></div></div></div></div>
<section class="sec"><div class="wrap">${inner}</div></section>`;
  return page(route, r, body);
}

/* ---------------- write ---------------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
function copyDir(src, dst, skip = []) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.includes(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
copyDir(path.join(ROOT, 'public'), DIST, ['_redirects', 'og-image.svg']);
copyDir(path.join(ROOT, 'site/assets'), path.join(DIST, 'assets'));

const pages = {
  '/': homePage(),
  '/residential': genericPage('/residential', { calc: true, cta: ' data-cta="hero_book_home_clean" data-page="residential"' }),
  '/commercial': commercialPage(),
  '/about': genericPage('/about'),
  '/quote': quotePage(),
  '/contact': contactPage(),
  '/thank-you': simplePage('/thank-you'),
  '/london-ontario-cleaning': genericPage('/london-ontario-cleaning', { form: true }),
  '/london-ontario-cleaning-offer': genericPage('/london-ontario-cleaning-offer', { form: true }),
  '/move-out': genericPage('/move-out', { form: true }),
  '/reset': genericPage('/reset', { form: true }),
  '/friday-reset': genericPage('/friday-reset', { form: true }),
  '/privacy-policy': simplePage('/privacy-policy', { prose: true }),
  '/terms': simplePage('/terms', { prose: true }),
  '/404': simplePage('/404', { noindexRoute: '/this-page-does-not-exist' }),
};
for (const t of D.townPages) pages[t.route] = townPage(t);

for (const [route, html] of Object.entries(pages)) {
  const file = route === '/' ? 'index.html' : route.slice(1) + '.html';
  fs.writeFileSync(path.join(DIST, file), html);
}
console.log(`built ${Object.keys(pages).length} pages into dist/`);
