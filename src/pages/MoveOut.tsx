import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Leaf, Clock, Phone, Gift, CalendarCheck } from 'lucide-react';
import HeroLeadForm from '../components/HeroLeadForm';

const included = [
  'Inside the oven, scrubbed and degreased',
  'Inside the fridge, wiped and sanitized',
  'Baseboards, door frames, and light switches',
  'Inside cabinets and drawers, wiped out',
  'Walls spot-wiped for marks and scuffs',
  'Bathrooms deep-cleaned, grout and fixtures',
  'Floors vacuumed and washed throughout',
  'Interior windows and sills wiped',
];

const bonusStack = [
  { label: 'Inside oven', value: '$35' },
  { label: 'Inside fridge', value: '$45' },
  { label: 'Baseboards + walls spot wipe', value: '$30' },
  { label: 'Inside cabinets', value: 'incl.' },
];

const pricing = [
  { tier: '1 bedroom', price: '$329', note: '1 bath, condo or apartment' },
  { tier: '2 bedroom', price: '$379', note: '1 bath, house or townhome' },
  { tier: '3 bedroom', price: '$419', note: 'up to 2,000 sq ft' },
  { tier: '4+ bedroom', price: '$489+', note: 'larger homes, quoted to size' },
];

const MoveOut: React.FC = () => {
  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>Move-Out Cleaning London Ontario | Move-Out Recovery System | Trydentt</title>
        <meta name="description" content="Leave a clean that passes inspection. The Trydentt Move-Out Recovery System is a flat-rate move-out clean in London, Ontario with oven, fridge, and baseboards included. Free quote in 60 seconds." />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/move-out" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Move-Out Recovery System | Trydentt Cleaning London" />
        <meta property="og:description" content="Flat-rate move-out cleaning built to pass your final walkthrough. Oven, fridge, and baseboards included. London, Ontario." />
        <meta property="og:url" content="https://www.trydenttcleaning.ca/move-out" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-indigo-50 via-white to-slate-50 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(50,100,185,0.08),transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <CalendarCheck className="w-4 h-4" />
                Move-Out Recovery System · London, Ontario
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-display leading-[1.1]">
                Leave a clean that<br />
                <span className="text-indigo-600">passes inspection.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                The corners. Inside the fridge. The marks no one wants to deal with. The Trydentt Move-Out Recovery System is flat-rate, built for your final walkthrough, with oven, fridge, and baseboards included.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Flat rate, quoted upfront. No surprises on the day',
                  'Oven, fridge, and baseboards included, not add-ons',
                  'Done right or we re-clean it, free',
                  'Fully insured and bonded team',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Insured and bonded</div>
                <div className="flex items-center gap-2"><Leaf className="w-4 h-4" /> Eco-friendly</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 2-hour response</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HeroLeadForm
                source="Landing Page: Move-Out Recovery System"
                sku="Move-Out Recovery System"
                badge="FREE MOVE-OUT QUOTE · NO OBLIGATION"
                heading="Get your free Move-Out quote"
                subheading="See your flat rate in 60 seconds. No sales call."
                ctaLabel="Get My Move-Out Quote"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scarcity + social proof */}
      <section className="py-8 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-center">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Insured and bonded · Eco-friendly · Locally owned in London</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200" />
          <p className="text-slate-600 font-medium">We take 6 move-out cleans a week. Mondays book first.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Flat-rate move-out pricing</h2>
            <p className="text-lg text-slate-600">One price, quoted before we start. The bonuses below are already inside every tier.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((tier) => (
              <div key={tier.tier} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{tier.tier}</div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">{tier.price}</div>
                <div className="text-sm text-slate-500">{tier.note}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-slate-500">Extra bathrooms add $25 each. Your exact price takes 60 seconds above.</div>
        </div>
      </section>

      {/* Bonus stack */}
      <section className="py-16 bg-indigo-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card bg-white rounded-3xl p-8 md:p-10 border border-indigo-100 shadow-xl shadow-indigo-900/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><Gift className="w-6 h-6" /></div>
              <div>
                <div className="text-xl font-bold text-slate-900 font-display">Over $120 of bonuses, already included</div>
                <div className="text-sm text-slate-500">Everywhere else these are paid add-ons. Here they are part of the clean.</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {bonusStack.map((b) => (
                <div key={b.label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <span className="text-slate-700 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600" />{b.label}</span>
                  <span className="text-slate-400 line-through text-sm">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Everything a landlord checks</h2>
            <p className="text-lg text-slate-600">Built around the exact spots that show up on a move-out walkthrough.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / after */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-display">The difference you can see</h2>
            <p className="text-lg text-slate-600">Real London homes, handed back inspection-ready.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { src: '/images/residential-before.jpg', label: 'Before' },
              { src: '/images/residential-after.jpg', label: 'After' },
            ].map((img) => (
              <div key={img.label} className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img src={img.src} alt={`Move-out clean ${img.label.toLowerCase()}`} loading="lazy" className="w-full h-72 object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">{img.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Done right or we re-clean it
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Ready to hand back the keys with confidence?</h2>
          <p className="text-indigo-100 mb-8 text-lg">Free flat-rate quote in 60 seconds. No phone calls, no pressure.</p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            Get my Move-Out quote →
          </a>
          <div className="mt-6 text-indigo-200 text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Or call (519) 871-3368
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoveOut;
