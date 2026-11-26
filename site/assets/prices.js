/* Trydentt Cleaning: the one price list. The /quote builder (quote.js) and the price box on the home,
   /residential, London and town pages (site.js) both read it, and build.mjs reads it to draw the box,
   so the two can never show different prices. Prices match Bubble Cleaning's live form, read
   2026-11-17 (Clients/Trydentt/Strategy/2026-11-17-bubble-cleaning-booking-teardown.md); figures
   marked "est" were worked out from their totals. All before HST. */
window.TC_PRICES = {
  svc: {
    standard: { name: 'Standard cleaning', base: 155, desc: 'Regular upkeep: dusting, floors, kitchen and bathrooms.' }, // base est
    deep:     { name: 'Deep cleaning',     base: 225, desc: 'Top to bottom, including the corners a regular clean skips.' },
    post:     { name: 'Post-construction', base: 340, desc: 'Fine dust and debris after a renovation.' } // base est
  },
  // What each count adds to the base price. Exact: bed 2 and 3, bath 1.5 and 2, kitchen 2. The rest est.
  add: {
    bed:  { 1: 0, 2: 30, 3: 70, 4: 105, 5: 140, 6: 175 },
    bath: { 1: 0, 1.5: 15, 2: 25, 2.5: 40, 3: 50, 3.5: 65, 4: 75 },
    kit:  { 1: 0, 2: 30, 3: 60 },
    liv:  { 1: 0, 2: 20, 3: 40 }
  },
  freq: [
    { id: 'once',     name: 'One time',      off: 0 },
    { id: 'weekly',   name: 'Every week',    off: 0.22 },
    { id: 'biweekly', name: 'Every 2 weeks', off: 0.16 },
    { id: 'every3',   name: 'Every 3 weeks', off: 0.12 },
    { id: 'every4',   name: 'Every 4 weeks', off: 0.10 }
  ]
};
