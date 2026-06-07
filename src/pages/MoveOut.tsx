import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Check, Star, Shield, Clock, Sparkles } from 'lucide-react';
import SKUCalculator from '../components/SKUCalculator';

const MoveOut: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Move-Out Cleaning London ON — Pass Inspection or We Re-Clean Free | Trydentt</title>
        <meta
          name="description"
          content="London tenants — leave a clean that passes inspection. Flat-rate move-out cleaning from $329. Oven, fridge, baseboards INCLUDED. 24h re-clean guarantee. Trydentt Cleaning London Ontario."
        />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/move-out" />
        <meta property="og:title" content="Move-Out Recovery System — Trydentt Cleaning London" />
        <meta property="og:description" content="Leave a clean that passes inspection. Flat-rate from $329. 24h re-clean guarantee." />
        <meta property="og:url" content="https://trydenttcleaning.ca/move-out" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-50 pt-12 pb-20">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold mb-6 uppercase tracking-wider"
          >
            <Sparkles className="w-3 h-3" />
            Move-Out Recovery System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-slate-900 leading-[1.05] max-w-4xl mx-auto"
          >
            Leave a clean that <span className="text-indigo-600">passes inspection</span> — guaranteed.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Flat-rate move-out cleaning for London tenants and homeowners. Inside the oven. Inside the fridge.
            Baseboards. Cabinets. Walls. <strong>All included</strong> — not a single hidden add-on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600"
          >
            <Trust icon={<Shield className="w-4 h-4 text-indigo-600" />} label="Bonded & insured" />
            <Trust icon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />} label="5.0 on Google" />
            <Trust icon={<Clock className="w-4 h-4 text-indigo-600" />} label="24h re-clean guarantee" />
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative -mt-12 mb-20 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SKUCalculator sku="move-out" />
      </section>

      {/* What's included */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              No hidden add-ons. No surprise upcharges.
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">
              What other cleaners charge extra for, <span className="text-indigo-600">we include.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INCLUDED_ITEMS.map(item => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            24-hour re-clean guarantee.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            If your landlord points out anything we missed during their final inspection,
            we are back within 24 hours to fix it — at no cost.
            That is the Trydentt Move-Out Recovery System.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
            Get your locked-in price in under 60 seconds.
          </h2>
          <p className="text-slate-600 mb-8">
            Tell us your home size and add-ons. We will lock the price and call within 24 hours to confirm the date.
          </p>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            Get my locked-in price
          </a>
        </div>
      </section>
    </>
  );
};

const Trust: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
    {icon}
    <span>{label}</span>
  </div>
);

const INCLUDED_ITEMS = [
  'Inside the oven (worth $35)',
  'Inside the fridge (worth $45)',
  'Inside all cabinets',
  'All baseboards',
  'Wall spot wipe-down',
  'Inside all closets',
  'Light fixtures & ceiling fans',
  'All door frames & trim',
  'Window sills & tracks',
  'Toilet, tub, shower deep sanitize',
  'Hard floor mop & vacuum',
  'Bonded & insured team',
];

export default MoveOut;
