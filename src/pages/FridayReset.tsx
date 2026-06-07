import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Check, Star, Shield, CalendarDays, Sparkles } from 'lucide-react';
import SKUCalculator from '../components/SKUCalculator';

const FridayReset: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Friday House Cleaning London ON — Walk Into a Showroom-Clean Home | Trydentt</title>
        <meta
          name="description"
          content="The Trydentt Friday Reset. Top-to-bottom one-off clean delivered every Friday. 23-Point Audit + free oven interior included. From $229. 24h re-clean guarantee."
        />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/friday-reset" />
        <meta property="og:title" content="Friday Reset — Trydentt Cleaning London" />
        <meta property="og:description" content="Walk into a showroom-clean house this Friday. From $229. 23-Point Audit + free oven interior included." />
        <meta property="og:url" content="https://trydenttcleaning.ca/friday-reset" />
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
            Friday Reset
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-slate-900 leading-[1.05] max-w-4xl mx-auto"
          >
            Walk into a <span className="text-indigo-600">showroom-clean</span> house this Friday.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Top-to-bottom one-off premium clean delivered every Friday. Real London cleaners. 23-Point Audit and
            <strong> free oven interior</strong> included. Not a $99 spray-and-pray.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600"
          >
            <Trust icon={<Shield className="w-4 h-4 text-indigo-600" />} label="Bonded & insured" />
            <Trust icon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />} label="5.0 on Google" />
            <Trust icon={<CalendarDays className="w-4 h-4 text-indigo-600" />} label="Friday delivery guaranteed" />
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative -mt-12 mb-20 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SKUCalculator sku="friday-reset" />
      </section>

      {/* What's included */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              The 23-Point Friday Reset Audit
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">
              Top to bottom. <span className="text-indigo-600">Nothing skipped.</span>
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

      {/* Why Friday delivery */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
            Why Friday delivery?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            You walk in after work to a home that smells like lemon, not laundry. Your weekend starts on a Friday
            night that does not include vacuuming. Your guests show up Saturday to a house that looks like nobody
            lives in it. That is the Friday Reset.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            24-hour Saturday morning re-clean.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Walk in Friday after work. If anything is not showroom-clean, we are back Saturday morning at no charge.
            That is the Trydentt Friday Reset guarantee.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
            Book my Friday Reset.
          </h2>
          <p className="text-slate-600 mb-8">
            Tell us your home size and which Friday. We lock the price and call within 24 hours to confirm.
          </p>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            Book my Friday Reset
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
  'Top-to-bottom dust',
  'Vacuum & mop all floors',
  'Free oven interior ($35 value)',
  'Bathroom deep sanitize',
  'Kitchen surfaces & appliances',
  'Counter tops & islands',
  'Mirrors & glass',
  'Inside microwave',
  'High-touch surface disinfection',
  'Baseboards (Friday-Reset add-on)',
  'Window sills & tracks',
  'Light fixtures & ceiling fans',
  'Door frames & trim',
  'Switch plates & door handles',
  'Toilet, tub, shower scrub',
  'Bonded & insured London team',
];

export default FridayReset;
