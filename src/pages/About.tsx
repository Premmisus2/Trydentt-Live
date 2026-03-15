import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Shield, Users, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>About Trydentt Cleaning | Trusted Ontario Cleaning Company</title>
        <meta name="description" content="Learn about Trydentt Cleaning Services — a trusted, Canadian-owned cleaning company serving Ontario. Over 30 years of combined experience, fully insured, 100% satisfaction guarantee." />
        <link rel="canonical" href="https://trydenttcleaning.ca/about" />
        <meta property="og:title" content="About Trydentt Cleaning | Trusted Ontario Cleaning Company" />
        <meta property="og:description" content="Canadian-owned, fully insured, 30+ years combined experience. Learn why Ontario trusts Trydentt." />
        <meta property="og:url" content="https://trydenttcleaning.ca/about" />
        <meta property="og:image" content="https://trydenttcleaning.ca/og-image.jpg" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://trydenttcleaning.ca/"},
              {"@type": "ListItem", "position": 2, "name": "About", "item": "https://trydenttcleaning.ca/about"}
            ]
          }
        `}</script>
      </Helmet>

      {/* Hero */}
      <section className="pt-20 pb-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-slate-900 mb-8"
            >
              The Trydentt <span className="text-indigo-600">Story</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 leading-relaxed"
            >
              Founded on the principle that cleanliness is the cornerstone of wellness and productivity, Trydentt Cleaning Services was born from a desire to bring a higher level of professionalism to the service industry.
            </motion.p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Meticulous', desc: "We don't just clean; we inspect. Our multi-point checklist ensures no detail is overlooked.", icon: <Target className="w-8 h-8 text-indigo-600" /> },
              { title: 'Reliable', desc: "Punctuality and consistency are our benchmarks. You can set your clock by our arrivals.", icon: <Shield className="w-8 h-8 text-indigo-600" /> },
              { title: 'Secure', desc: "Bonded and insured. Your keys, your property, and your data are in safe hands.", icon: <Users className="w-8 h-8 text-indigo-600" /> },
              { title: 'Passionate', desc: "We take pride in our work. Every space we clean is a reflection of our commitment to excellence.", icon: <Heart className="w-8 h-8 text-indigo-600" /> }
            ].map((v, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/about-team.jpg"
                width={600}
                height={400}
                loading="lazy"
                className="rounded-3xl shadow-2xl"
                alt="Trydentt Cleaning team delivering quality cleaning service in London Ontario"

              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-8">Our Quality Guarantee</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                We believe that our work speaks for itself, but we also believe in accountability. Every member of the Trydentt team is trained in our proprietary cleaning methodology, ensuring a consistent experience every single time.
              </p>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-indigo-600 font-bold text-xl mb-4">The Trydentt Promise</p>
                <p className="text-slate-700 italic leading-relaxed">
                  "If you are not 100% satisfied with your clean, notify us within 24 hours and we will return to make it right at no extra charge. That's our commitment to you."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
