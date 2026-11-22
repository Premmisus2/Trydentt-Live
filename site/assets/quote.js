/* Trydentt Cleaning: the /quote price builder. Prices match Bubble Cleaning's live form, read
   2026-11-17 (Clients/Trydentt/Strategy/2026-11-17-bubble-cleaning-booking-teardown.md); steps marked
   "est" were worked out from their totals. This file only draws the form and works out the price.
   site.js validates and sends it to /api/lead like every other form (data-form="builder"). */
(function () {
  'use strict';
  var form = document.querySelector('form[data-form="builder"]');
  if (!form) return;

  var SVC = {
    standard: { name: 'Standard cleaning', base: 155, desc: 'Regular upkeep: dusting, floors, kitchen and bathrooms.' }, // base est
    deep:     { name: 'Deep cleaning',     base: 225, desc: 'Top to bottom, including the corners a regular clean skips.' },
    post:     { name: 'Post-construction', base: 340, desc: 'Fine dust and debris after a renovation.' } // base est
  };
  // What each count adds to the base price. Exact: bed 2 and 3, bath 1.5 and 2, kitchen 2. The rest est.
  var ROOMS = [
    { id: 'bed',  icon: 'bed',     name: 'Bedrooms',     min: 1, max: 6, step: 1,   add: { 1: 0, 2: 30, 3: 70, 4: 105, 5: 140, 6: 175 } },
    { id: 'bath', icon: 'bath',    name: 'Bathrooms',    min: 1, max: 4, step: 0.5, add: { 1: 0, 1.5: 15, 2: 25, 2.5: 40, 3: 50, 3.5: 65, 4: 75 }, note: 'A half bath has a toilet and sink, no shower.' },
    { id: 'kit',  icon: 'kitchen', name: 'Kitchens',     min: 1, max: 3, step: 1,   add: { 1: 0, 2: 30, 3: 60 } },
    { id: 'liv',  icon: 'sofa',    name: 'Living rooms', min: 1, max: 3, step: 1,   add: { 1: 0, 2: 20, 3: 40 } }
  ];
  var FREQ = [
    { id: 'once',     name: 'One time',      off: 0 },
    { id: 'weekly',   name: 'Every week',    off: 0.22 },
    { id: 'biweekly', name: 'Every 2 weeks', off: 0.16 },
    { id: 'every3',   name: 'Every 3 weeks', off: 0.12 },
    { id: 'every4',   name: 'Every 4 weeks', off: 0.10 }
  ];
  var EXTRAS = [
    { id: 'oven',     icon: 'oven',       name: 'Inside oven',                 price: 30,  count: true },
    { id: 'fridge',   icon: 'fridge',     name: 'Inside fridge',               price: 30,  count: true },
    { id: 'cabinets', icon: 'cabinets',   name: 'Inside cabinets',             price: 5,   count: true, unit: 'cabinet' },
    { id: 'windows',  icon: 'window',     name: 'Inside windows',              price: 7,   count: true, unit: 'window' },
    { id: 'blinds',   icon: 'blinds',     name: 'Blinds, wiped down',          price: 20 },
    { id: 'walls',    icon: 'walls',      name: 'Walls, spot cleaned',         price: 8,   count: true, unit: 'wall' },
    { id: 'dishw',    icon: 'dishwasher', name: 'Inside dishwasher',           price: 25 },
    { id: 'dishes',   icon: 'dishes',     name: 'Dishes',                      price: 20,  count: true, unit: 'load' },
    { id: 'laundry',  icon: 'laundry',    name: 'Laundry, washed and folded',  price: 20,  count: true, unit: 'load', note: 'Washer and dryer need to be in the home.' },
    { id: 'basement', icon: 'basement',   name: 'Basement',                    price: 75 },
    { id: 'carpet',   icon: 'carpet',     name: 'Carpet shampoo, whole house', price: 100, note: 'Brushed, shampooed and dried with a carpet machine.' },
    { id: 'rug',      icon: 'rug',        name: 'Rug shampoo',                 price: 40,  count: true, unit: 'rug' },
    { id: 'pets',     icon: 'dog',        name: 'Pets in the home',            price: 10,  note: 'Extra time for pet hair.' },
    { id: 'eco',      icon: 'eco',        name: 'Eco-friendly products',       price: 10,  note: 'We use our eco-friendly products wherever they fit the job.' }
  ];
  var WINS = [['am', 'Morning', '8 to 10 am'], ['mid', 'Midday', '11 am to 1 pm'], ['pm', 'Afternoon', '2 to 4 pm']];
  var HST = 0.13;
  var TZ = 'America/Toronto';

  // The home page and /residential calculators still send ?service=; start on the matching clean.
  var q = new URLSearchParams(location.search);
  var fromCalc = (q.get('service') || '').toLowerCase();
  var st = {
    svc: /deep/.test(fromCalc) ? 'deep' : /construction/.test(fromCalc) ? 'post' : 'standard',
    freq: 'once',
    rooms: { bed: 2, bath: 1, kit: 1, liv: 1 },
    x: {}, day: -1, win: ''
  };

  function $(id) { return document.getElementById(id); }
  // Google Analytics: one event per builder step, once per page view, so its funnel report shows where people stop.
  var seen = {};
  function step(name) { if (seen[name]) return; seen[name] = 1; if (typeof window.gtag === 'function') window.gtag('event', name); }
  function money(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function short(n) { return money(n).replace('.00', ''); }
  function round2(n) { return Math.round(n * 100) / 100; }
  function icon(name, cls) { return '<img class="' + cls + '" src="/images/icons/' + name + '.svg" alt="" width="48" height="48">'; }

  function price() {
    var home = SVC[st.svc].base, lines = [], ex = 0;
    ROOMS.forEach(function (r) { home += r.add[st.rooms[r.id]]; });
    EXTRAS.forEach(function (e) {
      var n = st.x[e.id] || 0; if (!n) return;
      ex += e.price * n;
      lines.push({ name: e.name + (e.count ? ' × ' + n : ''), amt: e.price * n });
    });
    var f = FREQ.filter(function (x) { return x.id === st.freq; })[0];
    var sub = home + ex, off = round2(sub * f.off), after = round2(sub - off), tax = round2(after * HST);
    return { home: home, lines: lines, sub: sub, f: f, off: off, after: after, tax: tax, total: round2(after + tax) };
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function homeText() {
    var r = st.rooms;
    return plural(r.bed, 'bedroom') + ' · ' + r.bath + ' bath' + (r.bath === 1 ? '' : 's') + ' · ' + plural(r.kit, 'kitchen') + ' · ' + plural(r.liv, 'living room');
  }
  function dayDate(i) { return new Date(Date.now() + i * 86400000); }
  function whenText() {
    if (st.day < 0) return '';
    var t = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' }).format(dayDate(st.day));
    var w = WINS.filter(function (x) { return x[0] === st.win; })[0];
    return t + (w ? ', arriving ' + w[2] : '');
  }

  function stepper(key, v, min, max, label) {
    return '<div class="qb-step"><button type="button" data-dn="' + key + '"' + (v <= min ? ' disabled' : '') + ' aria-label="One less ' + label + '">−</button>' +
      '<output aria-live="polite">' + v + '</output><button type="button" data-up="' + key + '"' + (v >= max ? ' disabled' : '') + ' aria-label="One more ' + label + '">+</button></div>';
  }
  function renderKinds() {
    $('qb-kinds').innerHTML = Object.keys(SVC).map(function (k) {
      var s = SVC[k];
      return '<button type="button" class="qb-choice' + (st.svc === k ? ' on' : '') + '" data-k="' + k + '" aria-pressed="' + (st.svc === k) + '"><i class="qb-box"></i><b>' + s.name + '</b><strong>from ' + short(s.base) + '</strong><span>' + s.desc + '</span></button>';
    }).join('');
  }
  function renderFreq() {
    $('qb-freq').innerHTML = FREQ.map(function (f) {
      return '<button type="button" class="' + (f.id === 'once' ? 'once ' : '') + (st.freq === f.id ? 'on' : '') + '" data-f="' + f.id + '" aria-pressed="' + (st.freq === f.id) + '">' + f.name +
        '<small>' + (f.off ? Math.round(f.off * 100) + '% off each visit' : '&nbsp;') + '</small></button>';
    }).join('');
  }
  function renderRooms() {
    $('qb-rooms').innerHTML = ROOMS.map(function (r) {
      return '<div class="qb-row">' + icon(r.icon, 'qb-ri') + '<div class="qb-nm"><b>' + r.name + '</b>' + (r.note ? '<span>' + r.note + '</span>' : '') + '</div>' +
        stepper('r:' + r.id, st.rooms[r.id], r.min, r.max, r.name.toLowerCase()) + '</div>';
    }).join('');
  }
  function renderExtras() {
    $('qb-extras').innerHTML = EXTRAS.map(function (e) {
      var n = st.x[e.id] || 0;
      var label = '<em>' + short(e.price) + (e.unit ? ' a ' + e.unit : (e.count ? ' each' : '')) + '</em>';
      var ctl = e.count ? stepper('x:' + e.id, n, 0, 40, e.name.toLowerCase())
        : '<button type="button" class="qb-add' + (n ? ' on' : '') + '" data-t="' + e.id + '" aria-pressed="' + !!n + '">' + (n ? 'Added' : 'Add') + '</button>';
      return '<div class="qb-tile' + (n ? ' has' : '') + '"><div class="qb-ib">' + icon(e.icon, 'qb-ti') + '</div><b>' + e.name + '</b><span class="pr">' + label + '</span>' +
        (e.note ? '<span class="nt">' + e.note + '</span>' : '') + '<div class="ctl">' + ctl + '</div></div>';
    }).join('');
  }
  function renderDays() {
    var fD = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'short' });
    var fN = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, day: 'numeric' });
    var fM = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: 'short' });
    var out = [], months = [];
    for (var i = 1; i <= 14; i++) {
      var d = dayDate(i), m = fM.format(d);
      if (months.indexOf(m) < 0) months.push(m);
      out.push('<button type="button" data-d="' + i + '" class="' + (st.day === i ? 'on' : '') + '" aria-pressed="' + (st.day === i) + '">' + fD.format(d) + '<b>' + fN.format(d) + '</b></button>');
    }
    $('qb-days').innerHTML = out.join('');
    $('qb-months').textContent = 'Next two weeks · ' + months.join(' and ');
    $('qb-wins').innerHTML = WINS.map(function (w) {
      return '<button type="button" class="qb-choice' + (st.win === w[0] ? ' on' : '') + '" data-w="' + w[0] + '" aria-pressed="' + (st.win === w[0]) + '"><i class="qb-box"></i><b>' + w[1] + '</b><span>Team arrives ' + w[2] + '</span></button>';
    }).join('');
  }
  function sumHTML() {
    var p = price();
    var h = '<h3>' + SVC[st.svc].name + '</h3><div class="what">' + p.f.name + (whenText() ? ' · ' + whenText() : '') + '</div><div class="lines">';
    h += '<div class="l"><span>' + homeText() + '</span><span>' + money(p.home) + '</span></div>';
    p.lines.forEach(function (l) { h += '<div class="l"><span>' + l.name + '</span><span>' + money(l.amt) + '</span></div>'; });
    if (p.off) {
      h += '<div class="l sub"><span>Subtotal</span><span>' + money(p.sub) + '</span></div>';
      h += '<div class="l off"><span>' + p.f.name + ', ' + Math.round(p.f.off * 100) + '% off</span><span>−' + money(p.off) + '</span></div>';
    }
    h += '<div class="l"><span>HST 13%</span><span>' + money(p.tax) + '</span></div></div>';
    h += '<div class="tot"><b>Total</b><strong>' + money(p.total) + '</strong></div>';
    h += '<div class="each">' + (st.freq === 'once' ? 'Nothing is charged online.' : 'Each visit. Nothing is charged online.') + '</div>';
    h += '<div class="call">Questions first? Call or text <a href="tel:+15487617171">(548) 761-7171</a>.</div>';
    return h;
  }
  function render() {
    renderKinds(); renderFreq(); renderRooms(); renderExtras(); renderDays();
    var p = price();
    $('qb-sum').innerHTML = sumHTML();
    $('qb-sum2').innerHTML = sumHTML();
    $('qb-tb-tot').textContent = money(p.total);
    $('qb-tb-sub').textContent = st.freq === 'once' ? 'Total incl. HST' : 'Each visit, incl. HST';
    $('qb-send').textContent = 'Send my request · ' + money(p.total);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'qb-tb-open') { $('qb-sheet').classList.add('open'); document.body.style.overflow = 'hidden'; return; }
    if (b.id === 'qb-sh-close') { $('qb-sheet').classList.remove('open'); document.body.style.overflow = ''; return; }
    if (!form.contains(b) || b.type === 'submit') return;
    if (b.dataset.k) { st.svc = b.dataset.k; step('quote_kind'); }
    else if (b.dataset.f) { st.freq = b.dataset.f; step('quote_often'); }
    else if (b.dataset.d) { st.day = +b.dataset.d; step('quote_day'); }
    else if (b.dataset.w) { st.win = b.dataset.w; step('quote_time'); }
    else if (b.dataset.t) { st.x[b.dataset.t] = st.x[b.dataset.t] ? 0 : 1; step('quote_extra'); }
    else if (b.dataset.up || b.dataset.dn) {
      var key = b.dataset.up || b.dataset.dn, dir = b.dataset.up ? 1 : -1, kind = key.split(':')[0], id = key.split(':')[1];
      if (kind === 'r') { var r = ROOMS.filter(function (x) { return x.id === id; })[0]; st.rooms[id] = Math.min(r.max, Math.max(r.min, st.rooms[id] + dir * r.step)); step('quote_rooms'); }
      else { st.x[id] = Math.max(0, (st.x[id] || 0) + dir); step('quote_extra'); }
    } else return;
    if (st.day >= 0 && st.win) { var f = form.querySelector('.fail'); if (f && f.getAttribute('data-why') === 'when') f.classList.remove('show'); }
    render();
  });

  // What site.js sends to /api/lead. The Sheet keeps all of it; the owner text shows the first 120 characters.
  window.TC_QUOTE = {
    price: price,
    ready: function () { return st.day >= 0 && !!st.win; },
    service: function () { return SVC[st.svc].name + ', ' + price().f.name.toLowerCase(); },
    estimate: function () { var p = price(); return money(p.total) + (st.freq === 'once' ? '' : ' a visit') + ' incl. HST'; },
    details: function () {
      var p = price();
      return [
        'Preferred: ' + whenText(),
        'Home: ' + homeText().replace(/ · /g, ', '),
        'Extras: ' + (p.lines.length ? p.lines.map(function (l) { return l.name.replace(' × ', ' x') + ' ' + money(l.amt); }).join(', ') : 'none'),
        'Price: ' + money(p.sub) + (p.off ? ', ' + Math.round(p.f.off * 100) + '% off -' + money(p.off) : '') + ', HST ' + money(p.tax) + ', total ' + money(p.total)
      ];
    }
  };
  render();
  step('quote_open');
  form.addEventListener('focusin', function (e) { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) step('quote_details'); });
  form.addEventListener('submit', function () { step('quote_send_tap'); });
})();
