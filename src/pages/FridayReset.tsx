import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, Shield, Leaf, Clock, Phone, Sparkles, ClipboardCheck } from 'lucide-react';
import HeroLeadForm from '../components/HeroLeadForm';

const checklist = [
  'Kitchen degreased, counters and backsplash',
  'Inside the oven, included free',
  'Bathrooms deep-cleaned and sanitized',
  'Mirrors and glass streak-free',
  'Floors vacuumed and hand-washed',
  'Baseboards, sills, and switch plates',
  'Dusting top to bottom, high and low',
  'Beds made, surfaces reset',
];

const pricing = [
  { tier: '1 to 2 bedroom', price: '$229', note: 'top to bottom, Friday delivery' },
  { tier: '3 bedroom', price: '$289', note: 'top to bottom, Friday delivery' },
  { tier: '4+ bedroom', price: '$359', note: 'top to bottom, Friday delivery' },
];

const FridayReset: React.FC = () => {
  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>Friday House Cleaning London Ontario | The Friday Reset | Trydentt</title>
        <meta name="description" content="Walk into a showroom-clean home this Friday. The Trydentt Friday Reset is a top-to-bottom Friday-delivery clean in London, Ontario with a 23-point audit and free oven interior. Not a $99 spray-and-pray. Free quote in 60 seconds." />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/friday-reset" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="The Friday Reset | Trydentt Cleaning London" />
        <meta property="og:description" content="Top-to-bottom Friday-delivery cleaning in London, Ontario. 23-point audit, free oven interior, showroom-clean or we come back free." />
        <meta property="og:url" content="https://www.trydenttcleaning.ca/friday-reset" />
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
                <Sparkles className="w-4 h-4" />
                The Friday Reset · London, Ontario
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-display leading-[1.1]">
                Walk into a showroom-clean home<br />
                <span className="text-indigo-600">this Friday.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Real London cleaners. Real homes. The Friday Reset is a top-to-bottom, Friday-delivery clean for households that want a real reset, not a $99 spray-and-pray.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Delivered Friday, so your weekend starts clean',
                  '23-point audit on every clean',
                  'Free oven interior included',
                  'Showroom-clean or we come back free that weekend',
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
                source="Landing Page: Friday Reset"
                sku="Friday Reset"
                badge="BOOK YOUR FRIDAY · NO OBLIGATION"
                heading="Book my Friday Reset"
                subheading="See your flat rate in 60 seconds. No sales call."
                ctaLabel="Book My Friday Reset"
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
            <span>Insured · Bonded · Eco-friendly</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200" />
          <p className="text-slate-600 font-medium">Real London cleaners. Real homes. No spray-and-pray.</p>
        </div>
      </section>

      {/* Not a spray-and-pray */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">The $99 spray-and-pray</div>
              <ul className="space-y-3 text-slate-500">
                <li className="flex items-start gap-2"><span className="text-slate-300 mt-1">✕</span> A rotating stranger, in and out in an hour</li>
                <li className="flex items-start gap-2"><span className="text-slate-300 mt-1">✕</span> Surfaces wiped, corners skipped</li>
                <li className="flex items-start gap-2"><span className="text-slate-300 mt-1">✕</span> Oven and details cost extra</li>
                <li className="flex items-start gap-2"><span className="text-slate-300 mt-1">✕</span> No standard, no accountability</li>
              </ul>
            </div>
            <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow-xl shadow-indigo-900/20">
              <div className="text-sm font-bold text-indigo-200 uppercase tracking-wide mb-4">The Friday Reset</div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> A trained London team held to a checklist</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> 23-point audit, corners included</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> Free oven interior, no upsell</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> Showroom-clean or we come back free</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-indigo-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Flat Friday pricing</h2>
            <p className="text-lg text-slate-600">One price, quoted upfront. The 23-point audit and oven interior are already in it.</p>
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
          <div className="text-center mt-8 text-sm text-slate-500">Extra bathrooms add $25 each. Your exact price takes 60 seconds above.</div>
        </div>
      </section>

      {/* 23-point checklist */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-3"><ClipboardCheck className="w-5 h-5" /> The 23-Point Audit</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Held to a standard, every clean</h2>
            <p className="text-lg text-slate-600">A sample of what your team works through before they call it done.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {checklist.map((item) => (
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-display">What showroom-clean looks like</h2>
            <p className="text-lg text-slate-600">Real London homes, reset for the weekend.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { src: '/images/residential-before.jpg', label: 'Before' },
              { src: '/images/residential-after.jpg', label: 'After' },
            ].map((img) => (
              <div key={img.label} className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img src={img.src} alt={`Friday reset ${img.label.toLowerCase()}`} loading="lazy" className="w-full h-72 object-cover" />
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
            <Clock className="w-4 h-4" /> Book this week for a Friday delivery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Start your weekend showroom-clean.</h2>
          <p className="text-indigo-100 mb-8 text-lg">Free quote in 60 seconds. No phone calls, no pressure.</p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            Book my Friday Reset →
          </a>
          <div className="mt-6 text-indigo-200 text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Or call (519) 871-3368
          </div>
        </div>
      </section>
    </div>
  );
};

export default FridayReset;
