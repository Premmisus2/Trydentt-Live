import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Check, Star, Shield, Lock, Sparkles, Users } from 'lucide-react';
import SKUCalculator from '../components/SKUCalculator';

const Reset: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Bi-Weekly House Cleaning London ON — Locked Rate, Same Team Every Visit | Trydentt</title>
        <meta
          name="description"
          content="London parents — reclaim 6 Saturdays a year. Trydentt Bi-Weekly Reset from $179/visit. Same team every time. No contracts. Lock your annual rate + get your first deep clean FREE ($299 value)."
        />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/reset" />
        <meta property="og:title" content="Bi-Weekly Reset — Trydentt Cleaning London" />
        <meta property="og:description" content="Reclaim 6 Saturdays a year. Locked rate, same team every visit. From $179/visit." />
        <meta property="og:url" content="https://trydenttcleaning.ca/reset" />
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
            Bi-Weekly Reset Program
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-slate-900 leading-[1.05] max-w-4xl mx-auto"
          >
            Reclaim <span className="text-indigo-600">6 Saturdays a year.</span> Never come home to a dirty house again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Bi-weekly residential cleaning for London families. Same team every visit. No contracts. Lock your annual
            rate and your first deep clean is on us — <strong>$299 value, free</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600"
          >
            <Trust icon={<Shield className="w-4 h-4 text-indigo-600" />} label="Bonded & insured" />
            <Trust icon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />} label="5.0 on Google" />
            <Trust icon={<Users className="w-4 h-4 text-indigo-600" />} label="Same team every visit" />
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative -mt-12 mb-20 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SKUCalculator sku="bi-weekly" />
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              How the Bi-Weekly Reset works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">
              Three steps. <span className="text-indigo-600">Done.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(step => (
              <div
                key={step.title}
                className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual lock-in bonus */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-800/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Lock your rate for 12 months. Get your first deep clean FREE.
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Annual commitment = first deep clean ($299 value) included on us + locked per-visit rate for the year.
            No mid-year increases. No surprise fees. Same team, same price, every two weeks.
          </p>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            48-hour re-clean guarantee.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Find something we missed? Tell us within 48 hours and we are back to re-clean it free.
            That is the Trydentt Bi-Weekly Reset.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
            Lock my London rate in under 60 seconds.
          </h2>
          <p className="text-slate-600 mb-8">
            Tell us your home size. We lock the rate and call within 24 hours to confirm your start date.
          </p>
          <a
            href="#calculator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            Lock my London rate
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

const STEPS = [
  {
    number: '1',
    title: 'Pick your home size and frequency',
    body: 'Bi-weekly base price or +20% for weekly. Lock the annual rate if you want your first deep clean free.',
  },
  {
    number: '2',
    title: 'We call within 24 hours',
    body: 'We confirm your start date, assign the team that will own your home, and walk you through anything specific to your space.',
  },
  {
    number: '3',
    title: 'Come home to a reset every two weeks',
    body: 'Same team every visit. Same standard every clean. If anything is missed, we are back within 48 hours — free.',
  },
];

export default Reset;
