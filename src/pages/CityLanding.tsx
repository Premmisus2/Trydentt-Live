import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import {
  MapPin, ArrowRight, CheckCircle2, Star, Shield,
  Sparkles, Home as HomeIcon, Building2, Phone, Clock
} from 'lucide-react';

interface CityLandingProps {
  city: string;
  slug: string;
  distance: string;
  population: string;
  areas: string[];
  description: string;
}

const CityLanding: React.FC<CityLandingProps> = ({ city, slug, distance, population, areas, description }) => {
  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>Cleaning Services {city} Ontario | House & Office Cleaning | Trydentt</title>
        <meta name="description" content={`Professional cleaning services in ${city}, Ontario. Residential & commercial cleaning — eco-friendly, fully insured, 100% satisfaction guarantee. Free quotes from Trydentt Cleaning.`} />
        <link rel="canonical" href={`https://trydenttcleaning.ca/${slug}`} />
        <meta property="og:title" content={`Cleaning Services ${city} Ontario | Trydentt Cleaning`} />
        <meta property="og:description" content={`${city}'s trusted cleaning service. House cleaning, office cleaning, deep cleaning. Eco-friendly, insured, satisfaction guaranteed.`} />
        <meta property="og:url" content={`https://trydenttcleaning.ca/${slug}`} />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://trydenttcleaning.ca/"},
              {"@type": "ListItem", "position": 2, "name": "London Ontario Cleaning", "item": "https://trydenttcleaning.ca/london-ontario-cleaning"},
              {"@type": "ListItem", "position": 3, "name": "${city} Cleaning", "item": "https://trydenttcleaning.ca/${slug}"}
            ]
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Cleaning Service",
            "provider": {"@id": "https://trydenttcleaning.ca/#organization"},
            "areaServed": {"@type": "City", "name": "${city}", "addressRegion": "Ontario", "addressCountry": "CA"},
            "description": "Professional residential and commercial cleaning services in ${city}, Ontario. Eco-friendly, fully insured, 100% satisfaction guarantee."
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Does Trydentt Cleaning serve ${city}, Ontario?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Trydentt Cleaning Services is based in London, Ontario and proudly serves ${city} and all surrounding communities. We offer residential and commercial cleaning with eco-friendly products and a 100% satisfaction guarantee."
                }
              },
              {
                "@type": "Question",
                "name": "How much does house cleaning cost in ${city}?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "House cleaning in ${city}, Ontario typically ranges from $120 to $350 depending on home size and cleaning type. Trydentt offers free, transparent quotes with no hidden fees or travel surcharges for ${city} residents."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer commercial cleaning in ${city}?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We provide professional commercial cleaning for ${city} businesses including offices, retail stores, and industrial spaces. Flexible scheduling, fully insured, with custom proposals available."
                }
              }
            ]
          }
        `}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <MapPin className="w-4 h-4" />
              <span>Now Serving {city}, Ontario</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Professional Cleaning in <span className="text-indigo-600">{city}, Ontario</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.98 }} className="relative group">
                <Link to="/quote" className="relative z-10 inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-300">
                  <span>Get a Free Quote</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="absolute -inset-1 bg-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              </motion.div>
              <a href="tel:+15198713368" className="inline-flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-semibold text-lg transition-colors">
                <Phone className="w-5 h-5" />
                <span>(519) 871-3368</span>
              </a>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-500 font-medium">4.9/5 — Trusted across Southwestern Ontario</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Trydentt for City */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Why {city} Chooses Trydentt</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Just {distance} from our London base, {city} is part of our core service area. No travel fees, no compromises on quality.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: 'Fully Insured & Bonded', desc: 'Complete liability coverage for every job. Your property is always protected.' },
              { icon: <Sparkles className="w-8 h-8" />, title: 'Eco-Friendly Products', desc: 'Plant-based, EPA-certified products safe for families, pets, and the environment.' },
              { icon: <Clock className="w-8 h-8" />, title: 'No Travel Surcharges', desc: `${city} is within our core service zone. Same great prices as London, no extra fees.` }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Cleaning Services Available in {city}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Full-service residential and commercial cleaning for {city} homes and businesses.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><HomeIcon className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Residential Cleaning</h3>
              <ul className="space-y-3 mb-8">
                {['General house cleaning', 'Deep cleaning', 'Move-in / move-out cleaning', 'Post-construction cleanup', 'Eco-friendly cleaning', 'Seasonal cleaning'].map((s, i) => (
                  <li key={i} className="flex items-center text-slate-600"><CheckCircle2 className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />{s}</li>
                ))}
              </ul>
              <Link to="/residential" className="inline-flex items-center space-x-2 text-indigo-600 font-bold hover:text-indigo-500 transition-colors">
                <span>Learn More</span><ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-slate-900 rounded-3xl p-10 border border-slate-800 hover:border-indigo-500 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-slate-800 text-indigo-400 rounded-2xl flex items-center justify-center mb-6"><Building2 className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold text-white mb-4">Commercial Cleaning</h3>
              <ul className="space-y-3 mb-8">
                {['Office cleaning', 'Carpet & upholstery', 'Window & glass cleaning', 'Post-event cleanup', 'Janitorial services', 'Retail store cleaning'].map((s, i) => (
                  <li key={i} className="flex items-center text-slate-400"><CheckCircle2 className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />{s}</li>
                ))}
              </ul>
              <Link to="/commercial" className="inline-flex items-center space-x-2 text-white font-bold hover:text-indigo-300 transition-colors">
                <span>Learn More</span><ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Areas */}
      {areas.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Areas We Serve in {city}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Covering all of {city} and its surrounding communities.</p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {areas.map((a, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                  {a}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready for a spotless space in {city}?</h2>
                <p className="text-xl text-indigo-100 mb-10">Get your free, no-obligation quote today. We typically respond within 2 hours.</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-indigo-300" /><span className="text-sm font-medium">Free quotes</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-indigo-300" /><span className="text-sm font-medium">No travel fees</span></div>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Your Free Quote</h3>
                <p className="text-slate-600 mb-8">Trusted by families & businesses across {city}.</p>
                <Link to="/quote" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center space-x-2 group">
                  <span>Start My Quote</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-4 text-sm text-slate-400">Or call: <a href="tel:+15198713368" className="text-indigo-600 font-semibold">(519) 871-3368</a></p>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CityLanding;
