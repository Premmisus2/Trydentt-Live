import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, Star, Shield, Leaf, Clock, Phone } from 'lucide-react';
import HeroLeadForm from '../components/HeroLeadForm';

const LondonOntarioOffer: React.FC = () => {
  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>House Cleaning London Ontario from $150 | Instant Quote | Trydentt</title>
        <meta name="description" content="Professional house cleaning in London, Ontario from $150. Transparent pricing, no hidden fees. Free online quote in 60 seconds — no sales calls. Eco-friendly, fully insured." />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/london-ontario-cleaning-offer" />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="House Cleaning London Ontario from $150 | Trydentt" />
        <meta property="og:description" content="Transparent flat-rate cleaning in London, ON. See your exact price before you book. Eco-friendly, fully insured, satisfaction guaranteed." />
        <meta property="og:url" content="https://www.trydenttcleaning.ca/london-ontario-cleaning-offer" />
      </Helmet>

      {/* Hero with offer headline + inline lead form */}
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
                <Star className="w-4 h-4 fill-indigo-600" />
                Flat-rate cleaning · London, Ontario
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-display leading-[1.1]">
                House cleaning in London<br />
                <span className="text-indigo-600">from $150.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Transparent flat-rate pricing. Zero hidden fees. See your exact quote in 60 seconds — no sales call, no pressure.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Eco-friendly products, safe for kids and pets',
                  'Fully insured + bonded team',
                  '100% satisfaction guarantee',
                  'Same-week booking available',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Fully insured
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Eco-friendly
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 2-hour response
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass-card rounded-3xl p-6 md:p-8 bg-white shadow-2xl shadow-indigo-900/10 border border-slate-200/60">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Get your quote</div>
                  <div className="text-2xl font-bold text-slate-900">Instant price — no calls</div>
                </div>
                <HeroLeadForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof row */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-700 mb-3 font-medium">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-600" /> Fully insured and bonded</span>
              <span className="flex items-center gap-2"><Leaf className="w-4 h-4 text-indigo-600" /> Eco-friendly products</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-600" /> Same-week booking</span>
            </div>
            <p className="text-slate-600">Serving Byron, Masonville, Old North, Wortley Village, Hyde Park, Oakridge, and Lambeth</p>
          </div>
        </div>
      </section>

      {/* Pricing transparency */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              What does it actually cost?
            </h2>
            <p className="text-lg text-slate-600">
              Most London cleaning services hide the price behind a phone call. We don't.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { size: 'Condo / 1 bed', price: '$150', details: 'Up to 1,000 sq ft' },
              { size: '2–3 bedroom home', price: '$200–$275', details: '1,000–2,000 sq ft' },
              { size: '4+ bedroom home', price: '$300–$450', details: '2,000+ sq ft' },
            ].map((tier) => (
              <div key={tier.size} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 transition-colors">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{tier.size}</div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">{tier.price}</div>
                <div className="text-sm text-slate-500">{tier.details}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-slate-500">
            Final price depends on bedrooms, bathrooms, and condition. Exact quote in 60 seconds — above.
          </div>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
            Ready to get Friday night back?
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Free online quote in 60 seconds. No phone calls. No pressure.
          </p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 rounded-full font-bold hover:bg-indigo-50 transition-colors"
          >
            Get my exact price →
          </a>
          <div className="mt-6 text-indigo-200 text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Or call (519) 871-3368
          </div>
        </div>
      </section>
    </div>
  );
};

export default LondonOntarioOffer;
