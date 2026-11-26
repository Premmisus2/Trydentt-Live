/* Trydentt Cleaning: menu, calculator, forms and tracking. Every form posts to /api/lead and only
   moves to /thank-you once the lead is delivered. If it isn't, the visitor is told to call. */
(function () {
  'use strict';
  var PHONE = '(548) 761-7171';
  var TEL = 'tel:+15487617171';
  var CALC = window.TC_CALC || null;

  function cookie(n) {
    var m = document.cookie.match(new RegExp('(^|;\\s*)' + n + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : undefined;
  }
  function qs() { return new URLSearchParams(location.search); }
  function utm() {
    var q = qs();
    return {
      utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', utm_term: q.get('utm_term') || '',
      utm_content: q.get('utm_content') || ''
    };
  }
  function uuid() {
    return (window.crypto && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : undefined;
  }
  function meta() {
    return { landing_page: location.href, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent };
  }
  function assign(a) { for (var i = 1; i < arguments.length; i++) { var b = arguments[i]; for (var k in b) a[k] = b[k]; } return a; }
  function gt() { if (typeof window.gtag === 'function') window.gtag.apply(null, arguments); }
  function fb() { if (typeof window.fbq === 'function') window.fbq.apply(null, arguments); }

  /* ---------- menu ---------- */
  var mb = document.querySelector('.menubtn'), mn = document.querySelector('.mnav');
  if (mb && mn) {
    mb.addEventListener('click', function () { mn.classList.add('open'); document.body.style.overflow = 'hidden'; });
    mn.querySelector('.x button').addEventListener('click', function () { mn.classList.remove('open'); document.body.style.overflow = ''; });
    mn.addEventListener('click', function (e) { if (e.target.tagName === 'A') { mn.classList.remove('open'); document.body.style.overflow = ''; } });
  }

  /* ---------- GA4 cta_click ---------- */
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () { gt('event', 'cta_click', { event_label: el.getAttribute('data-cta'), page: el.getAttribute('data-page') || '' }); });
  });

  /* ---------- calculator ---------- */
  function estimate(niche, service, sqft) {
    var list = CALC.niches[niche], m = 0;
    for (var i = 0; i < list.length; i++) if (list[i][0] === service) m = list[i][1];
    var base = sqft * m, lo = Math.floor(base * 0.9), hi = Math.ceil(base * 1.1);
    var F = CALC.floors.MIN_FLOOR, FM = CALC.floors.MIN_FLOOR_MAX;
    if (hi <= F) return [F, FM];
    if (lo < F) return [F, hi];
    return [lo, hi];
  }
  // The price box (home, /residential, London and towns). Home side: the builder's own prices (prices.js), and
  // "Lock in this price" opens /quote at step 1 with the same picks. Business side: the square-foot estimate above,
  // carried into the audit form on /commercial (the builder is homes only). The buttons are plain links kept current.
  var PR = window.TC_PRICES || null;
  function boxMoney(n) { var t = n.toFixed(2); return '$' + (t.slice(-3) === '.00' ? t.slice(0, -3) : t); }
  function r2(n) { return Math.round(n * 100) / 100; }
  document.querySelectorAll('.calc').forEach(function (box) {
    var home = box.querySelector('[data-side="residential"]'), biz = box.querySelector('[data-side="commercial"]');
    if (!CALC || !PR || !home || !biz) return;
    var st = { svc: 'standard', bed: 2, bath: 1 }, LIM = { bed: [1, 6, 1], bath: [1, 4, 0.5] };
    var bi = PR.freq.filter(function (f) { return f.id === 'biweekly'; })[0].off;
    var sel = biz.querySelector('select'), sq = biz.querySelector('input[type=range]');
    function side(n) {
      box.querySelectorAll('.seg button').forEach(function (b) { var on = b.getAttribute('data-n') === n; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      home.hidden = n !== 'residential'; biz.hidden = n !== 'commercial';
    }
    function drawHome() {
      var once = PR.svc[st.svc].base + PR.add.bed[st.bed] + PR.add.bath[st.bath];
      var kind = home.querySelector('[data-k="' + st.svc + '"]');
      home.querySelector('[data-total]').textContent = boxMoney(once);
      home.querySelector('[data-kdesc]').textContent = PR.svc[st.svc].desc;
      home.querySelector('[data-what]').textContent = kind.getAttribute('data-name') + ', one visit, before HST. Includes 1 kitchen and 1 living room.';
      home.querySelector('[data-rep] b').textContent = boxMoney(r2(once - r2(once * bi)));
      home.querySelectorAll('[data-k]').forEach(function (b) { var on = b === kind; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      ['bed', 'bath'].forEach(function (k) {
        home.querySelector('[data-o="' + k + '"]').textContent = st[k];
        home.querySelector('[data-dn="' + k + '"]').disabled = st[k] <= LIM[k][0];
        home.querySelector('[data-up="' + k + '"]').disabled = st[k] >= LIM[k][1];
      });
      home.querySelector('[data-go]').setAttribute('href', '/quote?' + new URLSearchParams({ service: st.svc, bed: String(st.bed), bath: String(st.bath) }).toString() + '#qb-s-kind');
    }
    function drawBiz() {
      var v = +sq.value, r = estimate('commercial', sel.value, v);
      biz.querySelector('.sqv').textContent = v.toLocaleString('en-CA') + ' sq ft';
      biz.querySelector('[data-range]').textContent = '$' + r[0] + ' to $' + r[1];
      biz.querySelector('[data-biz]').setAttribute('href', '/commercial?' + new URLSearchParams({ sqft: String(v) }).toString() + '#audit-form');
    }
    box.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-n')) { side(t.getAttribute('data-n')); return; }
      if (t.hasAttribute('data-k')) st.svc = t.getAttribute('data-k');
      else if (t.hasAttribute('data-up')) { var u = t.getAttribute('data-up'); st[u] = Math.min(LIM[u][1], st[u] + LIM[u][2]); }
      else if (t.hasAttribute('data-dn')) { var d = t.getAttribute('data-dn'); st[d] = Math.max(LIM[d][0], st[d] - LIM[d][2]); }
      else return;
      drawHome();
    });
    sel.addEventListener('change', drawBiz); sq.addEventListener('input', drawBiz);
    var p = qs().get('niche');
    side(p && /^commercial$/i.test(p) ? 'commercial' : 'residential');
    drawHome(); drawBiz();
  });
  var cSq = document.querySelector('[data-form="commercial"] [name="sqft"]'), qSq = qs().get('sqft');
  if (cSq && qSq && /^\d{3,6}$/.test(qSq)) cSq.value = qSq;

  /* ---------- quote booking (on /quote) ---------- */
  var booking = document.querySelector('[data-form="booking"]');
  var result = null;
  function openBooking(r, fireEvents) {
    if (!booking) return;
    result = {
      estimate: '$' + r.min + ' - ' + r.max,
      recommendations: ['Service: ' + r.service + ' (' + r.niche + ')', 'Size: ' + r.sqft + ' sqft', 'Professional Equipment Included', 'Satisfaction Guaranteed'],
      niche: r.niche, service: r.service, sqft: r.sqft, minPrice: r.min, maxPrice: r.max
    };
    var s = document.querySelector('.summary');
    if (s) {
      s.querySelector('b').textContent = '$' + r.min + ' to $' + r.max;
      s.querySelector('ul').innerHTML = result.recommendations.map(function (x) { return '<li>' + x.replace(/[<>&]/g, '') + '</li>'; }).join('');
    }
    document.querySelector('.step-calc').hidden = true;
    document.querySelector('.step-book').hidden = false;
    window.scrollTo(0, document.querySelector('.step-book').getBoundingClientRect().top + window.scrollY - 90);
    if (fireEvents) {
      fb('track', 'InitiateCheckout', { content_name: r.service, content_category: r.niche, value: r.min, currency: 'CAD' });
      gt('event', 'begin_checkout', { currency: 'CAD', value: r.min, items: [{ item_name: r.service, item_category: r.niche }] });
    }
  }
  if (booking) {
    var q = qs();
    if (q.get('niche') && q.get('service') && q.get('min') && q.get('max')) {
      openBooking({ niche: q.get('niche'), service: q.get('service'), sqft: q.get('sqft') ? parseInt(q.get('sqft'), 10) : undefined, min: parseInt(q.get('min'), 10), max: parseInt(q.get('max'), 10) }, false);
    }
    var back = document.querySelector('[data-back]');
    if (back) back.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.step-calc').hidden = false;
      document.querySelector('.step-book').hidden = true;
    });
  }

  /* ---------- validation ---------- */
  function setErr(form, name, msg) {
    var f = form.querySelector('[data-f="' + name + '"]');
    if (!f) return;
    f.classList.toggle('bad', !!msg);
    var e = f.querySelector('.err'); if (e) e.textContent = msg || '';
  }
  function vPhone(v) {
    var d = (v || '').replace(/\D/g, '');
    if (!v) return 'Phone number is required';
    if (d.length !== 10) return 'Please enter a 10-digit phone number.';
    return '';
  }
  function vPostal(v, eg) {
    if (!v) return 'Postal code is required';
    if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v)) return 'Please enter a valid Canadian postal code (e.g., ' + eg + ').';
    return '';
  }
  function vEmail(v) {
    if (!v) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      if (v.indexOf('@') === -1) return "Please include an '@' in the email address. '" + v + "' is missing an '@'.";
      return 'Please enter a valid email address.';
    }
    return '';
  }

  /* ---------- send ---------- */
  function busy(form, on) {
    var b = form.querySelector('button[type=submit]');
    if (!b) return;
    if (on) { b._t = b.textContent; b.textContent = b.getAttribute('data-busy') || 'Sending...'; b.disabled = true; }
    else { b.textContent = b._t || b.textContent; b.disabled = false; }
  }
  function failMsg(form) {
    var f = form.querySelector('.fail');
    if (!f) return;
    f.innerHTML = "This didn't send, so we haven't got your details. Please call us on <a href=\"" + TEL + "\">" + PHONE + '</a>.';
    f.classList.add('show');
    f.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function send(form, payload, eventId, value) {
    var f = form.querySelector('.fail'); if (f) f.classList.remove('show');
    busy(form, true);
    fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok === true, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { busy(form, false); failMsg(form); return; }
        if (eventId) sessionStorage.setItem('trydentt_lead_event_id', (res.j && res.j.eventId) || eventId);
        if (value != null) sessionStorage.setItem('trydentt_lead_value', String(value));
        location.href = '/thank-you';
      })
      .catch(function () { busy(form, false); failMsg(form); });
  }
  function val(form, n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var kind = form.getAttribute('data-form'), id = uuid(), bad = false, payload;
      if (kind === 'hero') {
        var ph = val(form, 'phone'), pc = val(form, 'postalCode');
        var a = vPhone(ph), b = vPostal(pc, 'N6A 1A1');
        setErr(form, 'phone', a); setErr(form, 'postalCode', b);
        if (!val(form, 'name')) { setErr(form, 'name', 'Please enter your name.'); bad = true; } else setErr(form, 'name', '');
        if (a || b || bad) return;
        payload = assign({ name: val(form, 'name'), phone: '+1 ' + ph, postalCode: pc, source: form.getAttribute('data-source'), niche: form.getAttribute('data-niche') || 'residential' },
          form.getAttribute('data-sku') ? { sku: form.getAttribute('data-sku') } : {}, utm(), { landing_page: location.href, event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent });
        send(form, payload, id, null);
      } else if (kind === 'booking') {
        var em = val(form, 'email'), bp = val(form, 'phone'), bpc = val(form, 'postalCode');
        var x = vEmail(em), y = vPhone(bp), z = vPostal(bpc, 'A1A 1A1');
        setErr(form, 'email', x); setErr(form, 'phone', y); setErr(form, 'postalCode', z);
        ['name', 'address', 'city'].forEach(function (n) { var m = val(form, n) ? '' : 'This field is required.'; setErr(form, n, m); if (m) bad = true; });
        if (x || y || z || bad || !result) return;
        var prefix = '+1';
        payload = assign({ name: val(form, 'name'), email: em, phone: prefix + ' ' + bp, phonePrefix: prefix, address: val(form, 'address'), city: val(form, 'city'), postalCode: bpc,
          estimate: result.estimate, serviceDetails: result.recommendations, niche: result.niche, service: result.service, sqft: result.sqft,
          minPrice: result.minPrice, maxPrice: result.maxPrice, source: 'Website Smart Estimator' }, utm(), { landing_page: location.href, event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent });
        send(form, payload, id, result.minPrice);
      } else if (kind === 'builder') {
        var Q = window.TC_QUOTE, qf = form.querySelector('.fail');
        if (!Q) return;
        var qp = val(form, 'phone'), qe = val(form, 'email'), qz = val(form, 'postalCode');
        var errs = {
          name: val(form, 'name') ? '' : 'Please enter your name.', phone: vPhone(qp), email: vEmail(qe),
          address: val(form, 'address') ? '' : 'Please enter the street address.', postalCode: vPostal(qz, 'N6A 1A1')
        };
        Object.keys(errs).forEach(function (n) { setErr(form, n, errs[n]); });
        var firstBad = Object.keys(errs).filter(function (n) { return errs[n]; })[0];
        if (qf) qf.classList.remove('show');
        if (!Q.ready()) {
          if (qf) { qf.textContent = 'Pick a preferred day and an arrival window above.'; qf.setAttribute('data-why', 'when'); qf.classList.add('show'); }
          document.getElementById('qb-s-when').scrollIntoView({ block: 'start', behavior: 'smooth' });
          return;
        }
        if (firstBad) { form.querySelector('[data-f="' + firstBad + '"]').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
        if (qf) qf.removeAttribute('data-why');
        var qunit = val(form, 'unit');
        payload = assign({ name: val(form, 'name'), email: qe, phone: '+1 ' + qp, phonePrefix: '+1',
          address: val(form, 'address') + (qunit ? ', unit ' + qunit : ''), city: val(form, 'city'), postalCode: qz.toUpperCase(),
          niche: 'residential', service: Q.service(), estimate: Q.estimate(), serviceDetails: Q.details(), message: val(form, 'entry'),
          source: 'Website Price Builder' }, utm(), { landing_page: location.href, event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent });
        send(form, payload, id, Q.price().after);
      } else if (kind === 'contact') {
        var ce = val(form, 'email'), cz = val(form, 'zip');
        var ex = vEmail(ce); setErr(form, 'email', ex);
        var zx = cz ? '' : 'Postal code is required'; setErr(form, 'zip', zx);
        var nx = val(form, 'name') ? '' : 'Please enter your name.'; setErr(form, 'name', nx);
        if (ex || zx || nx) return;
        var type = val(form, 'type') || 'Residential';
        payload = assign({ name: val(form, 'name'), email: ce, phone: val(form, 'phone') || undefined, zip: cz, type: type, message: val(form, 'message'),
          postalCode: cz, niche: type === 'Commercial' ? 'commercial' : 'residential', service: type, source: 'Contact Page Form' }, utm(),
          { landing_page: location.href, event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent });
        send(form, payload, id, null);
      } else if (kind === 'commercial') {
        var miss = !val(form, 'businessName') || !val(form, 'contactName') || !val(form, 'phone');
        var cm = form.querySelector('.cmsg');
        if (miss) { cm.textContent = 'Business name, contact name, and phone are required.'; cm.hidden = false; return; }
        cm.hidden = true;
        payload = { name: val(form, 'contactName'), phone: val(form, 'phone'), email: val(form, 'email'), niche: 'commercial', service: 'Class-A Office Standard',
          sku: 'class-a-office', source: 'commercial-audit-form', landing_page: location.href,
          serviceDetails: ['Business: ' + val(form, 'businessName'), 'Role: ' + val(form, 'role'), 'Sqft: ' + val(form, 'sqft'), 'Building: ' + val(form, 'buildingType'),
            'Frequency: ' + val(form, 'frequency'), 'Current cleaner: ' + val(form, 'currentCleaner'), 'Preferred audit: ' + val(form, 'preferredAuditDate')],
          event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent };
        send(form, payload, id, null);
      } else if (kind === 'callback') {
        var kp = val(form, 'phone'), ke = vPhone(kp); setErr(form, 'phone', ke);
        var kn = val(form, 'name') ? '' : 'Please enter your name.'; setErr(form, 'name', kn);
        if (ke || kn) return;
        var kind2 = val(form, 'kind');
        payload = assign({ name: val(form, 'name'), phone: '+1 ' + kp, city: val(form, 'city'), message: val(form, 'message'),
          niche: kind2 === 'Business' ? 'commercial' : 'residential', service: kind2 === 'Business' ? 'Commercial cleaning' : 'Home cleaning', source: 'Home Page Call Back Form' },
          utm(), { landing_page: location.href, event_id: id, fbp: cookie('_fbp'), fbc: cookie('_fbc'), client_user_agent: navigator.userAgent });
        send(form, payload, id, null);
      }
    });
  });

  /* ---------- thank-you conversions, once per session ---------- */
  if (document.body.getAttribute('data-route') === '/thank-you') {
    var FIRED = 'trydentt_lead_fired';
    if (sessionStorage.getItem(FIRED) !== '1') {
      sessionStorage.setItem(FIRED, '1');
      var ev = sessionStorage.getItem('trydentt_lead_event_id') || undefined;
      if (ev) fb('track', 'Lead', {}, { eventID: ev }); else fb('track', 'Lead');
      gt('event', 'page_view', { page_path: '/thank-you', page_title: 'Thank You', page_location: location.href });
      gt('event', 'generate_lead', { event_category: 'conversion', event_label: 'form_submission' });
      var lv = sessionStorage.getItem('trydentt_lead_value');
      var lvn = lv && !isNaN(Number(lv)) ? Number(lv) : undefined;
      var conv = { send_to: 'AW-17950162168/G0jUCLWJ5bocEPj5pu9C', currency: 'CAD' };
      if (lvn) conv.value = lvn;
      gt('event', 'conversion', conv);
    }
  }
})();
