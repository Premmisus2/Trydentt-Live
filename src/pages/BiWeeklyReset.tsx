import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Leaf, Lock, Phone, Users, Repeat } from 'lucide-react';
import HeroLeadForm from '../components/HeroLeadForm';

const included = [
  'Kitchen wiped down, counters and stovetop degreased',
  'Bathrooms sanitized, mirrors and fixtures polished',
  'Floors vacuumed and washed every visit',
  'Dusting from baseboards to shelves to sills',
  'Beds made and surfaces tidied',
  'The same trained team, every single visit',
];

const pricing = [
  { tier: '1 to 2 bedroom', price: '$179', note: 'per visit, flat' },
  { tier: '3 bedroom', price: '$219', note: 'per visit, flat' },
  { tier: '4+ bedroom', price: '$259', note: 'per visit, flat' },
];

const whyPoints = [
  { icon: Lock, title: 'Your rate is locked', body: 'The price you start at is the price you keep. No annual creep, no surprise increases.' },
  { icon: Users, title: 'Same team every time', body: 'The same cleaners who already know your home and how you like it. No rotating strangers.' },
  { icon: Repeat, title: 'Never let it get bad', body: 'A reset every two weeks means your home never falls into the deep-clean hole again.' },
];

const BiWeeklyReset: React.FC = () => {
  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>Bi-Weekly Cleaning London Ontario | The Bi-Weekly Reset | Trydentt</title>
        <meta name="description" content="Reclaim 6 Saturdays a year with the Trydentt Bi-Weekly Reset. Flat per-visit rate, locked for good, same team every visit, no contracts. Recurring house cleaning in London, Ontario. Free quote in 60 seconds." />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/reset" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Bi-Weekly Reset | Trydentt Cleaning London" />
        <meta property="og:description" content="Locked-rate recurring cleaning in London, Ontario. Same team every visit, no contracts. Reclaim your weekends." />
        <meta property="og:url" content="https://www.trydenttcleaning.ca/reset" />
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
                <Repeat className="w-4 h-4" />
                The Bi-Weekly Reset · London, Ontario
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-display leading-[1.1]">
                Reclaim 6 Saturdays<br />
                <span className="text-indigo-600">a year.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                What if every day felt like cleaning day, without the work? The Bi-Weekly Reset keeps your London home in a steady state of clean, with a locked rate and the same team every visit.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Flat per-visit rate, locked for as long as you stay',
                  'The same trained team, every visit',
                  'No contracts. Cancel anytime',
                  'Annual lock-in: your first deep clean free, a $299 value',
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
                <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> Locked rate</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HeroLeadForm
                source="Landing Page: Bi-Weekly Reset Program"
                sku="Bi-Weekly Reset Program"
                badge="LOCK YOUR RATE · NO OBLIGATION"
                heading="Lock my London rate"
                subheading="See your flat per-visit price in 60 seconds. No sales call."
                ctaLabel="Lock My Rate"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-center">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span>Insured and bonded · Same team every visit · No contracts</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200" />
          <p className="text-slate-600 font-medium">Byron · Masonville · Old North · Wortley · Hyde Park · Oakridge</p>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Why families lock in the Reset</h2>
            <p className="text-lg text-slate-600">It is not a once-a-month touch-up. It is a system that keeps your home from ever getting bad.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyPoints.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4"><p.icon className="w-6 h-6" /></div>
                <div className="text-lg font-bold text-slate-900 mb-2 font-display">{p.title}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-indigo-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Flat per-visit pricing</h2>
            <p className="text-lg text-slate-600">No frequency games, no discount that quietly expires. One honest rate, locked.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {pricing.map((tier) => (
              <div key={tier.tier} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 transition-colors text-center">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{tier.tier}</div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">{tier.price}</div>
                <div className="text-sm text-slate-500">{tier.note}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-slate-500">Prefer weekly? Add 20% per visit and keep the same locked rate. Your exact price takes 60 seconds above.</div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">What every reset includes</h2>
            <p className="text-lg text-slate-600">Consistent, top to bottom, every two weeks.</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-display">This is what home should feel like</h2>
            <p className="text-lg text-slate-600">Real London homes, kept this way on repeat.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { src: '/images/home-before.jpg', label: 'Before' },
              { src: '/images/home-after.jpg', label: 'After' },
            ].map((img) => (
              <div key={img.label} className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img src={img.src} alt={`Bi-weekly reset ${img.label.toLowerCase()}`} loading="lazy" className="w-full h-72 object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">{img.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Lock className="w-4 h-4" /> Lock today, keep this rate for good
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Get your Saturdays back.</h2>
          <p className="text-indigo-100 mb-8 text-lg">Free quote in 60 seconds. No contracts, no phone calls, no pressure.</p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            Lock my London rate →
          </a>
          <div className="mt-6 text-indigo-200 text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Or call (519) 871-3368
          </div>
        </div>
      </section>
    </div>
  );
};

export default BiWeeklyReset;
