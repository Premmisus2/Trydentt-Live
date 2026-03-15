import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import QuickCalculator from '../components/QuickCalculator';
import Sparkle from '../components/Sparkle';
import ServiceCard from '../components/ServiceCard';
import { 
  Shield, Sparkles, Clock, ArrowRight, Star, 
  Building2, AlertCircle, Frown, 
  CheckCircle2, Users, Trophy, Zap, 
  Briefcase, Store, GlassWater, PartyPopper,
  MapPin, Send, XCircle
} from 'lucide-react';

const Commercial: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const commercialServices = [
    { 
      name: 'Office Cleaning', 
      desc: 'Productive environments through professional hygiene.', 
      details: 'Boost productivity with a spotless workspace. We handle trash removal, restroom sanitation, and breakroom cleaning on a schedule that fits your operations.',
      icon: <Briefcase className="w-6 h-6" /> 
    },
    { 
      name: 'Carpet & Upholstery', 
      desc: 'Deep fiber cleaning for high-traffic business areas.', 
      details: 'Revitalize your office furniture and flooring. Our hot water extraction method removes deep-seated dirt and allergens, extending the life of your assets.',
      icon: <Zap className="w-6 h-6" /> 
    },
    { 
      name: 'Window & Glass', 
      desc: 'Crystal clear views for your storefront or office.', 
      details: 'Let the light in with streak-free window cleaning. We clean interior and exterior glass, including partitions and mirrors, for a crystal-clear view.',
      icon: <GlassWater className="w-6 h-6" /> 
    },
    { 
      name: 'Post-Event Cleaning', 
      desc: 'Rapid restoration after your corporate gatherings.', 
      details: 'From corporate galas to office parties, we handle the aftermath. We\'ll have your venue back to business-ready condition in record time.',
      icon: <PartyPopper className="w-6 h-6" /> 
    },
    { 
      name: 'Janitorial Services', 
      desc: 'Consistent, daily maintenance for your facility.', 
      details: 'Comprehensive day-to-day facility management. We restock supplies, maintain floors, and ensure your building meets all health and safety standards.',
      icon: <Shield className="w-6 h-6" /> 
    },
    { 
      name: 'Retail Store Cleaning', 
      desc: 'Pristine shopping experiences for your customers.', 
      details: 'Create an inviting atmosphere for your customers. We focus on high-traffic areas, fitting rooms, and displays to enhance the shopping experience.',
      icon: <Store className="w-6 h-6" /> 
    },
  ];

  return (
    <div className="overflow-hidden bg-slate-50 selection:bg-indigo-600/20 selection:text-indigo-900">
      <Helmet>
        <title>Commercial Cleaning Ontario | Office & Janitorial | Trydentt</title>
        <meta name="description" content="Professional commercial cleaning services across Ontario. Office cleaning, janitorial, carpet & upholstery, window cleaning, post-event cleanup. Fully insured & bonded. Get a custom proposal." />
        <link rel="canonical" href="https://trydenttcleaning.ca/commercial" />
        <meta property="og:title" content="Commercial Cleaning Ontario | Trydentt Cleaning Services" />
        <meta property="og:description" content="Professional commercial cleaning for Ontario businesses. Office, retail, janitorial services. Fully insured & bonded." />
        <meta property="og:url" content="https://trydenttcleaning.ca/commercial" />
        <meta property="og:image" content="https://trydenttcleaning.ca/og-image.jpg" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://trydenttcleaning.ca/"},
              {"@type": "ListItem", "position": 2, "name": "Commercial Cleaning", "item": "https://trydenttcleaning.ca/commercial"}
            ]
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Commercial Cleaning",
            "provider": {"@id": "https://trydenttcleaning.ca/#organization"},
            "areaServed": {"@type": "City", "name": "London", "addressRegion": "Ontario", "addressCountry": "CA"},
            "description": "Professional commercial cleaning services in London, Ontario. Office cleaning, janitorial, carpet & upholstery, window cleaning. Fully insured & bonded.",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "CAD",
              "availability": "https://schema.org/InStock"
            }
          }
        `}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Do you offer after-hours commercial cleaning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We schedule our commercial cleaning around your business hours so your operations are never disrupted. Evening and weekend cleaning is available for offices, retail stores, and commercial spaces in London, Ontario."
                }
              },
              {
                "@type": "Question",
                "name": "How do you handle commercial cleaning contracts?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide customized proposals based on your facility size, cleaning frequency, and specific requirements. We offer flexible month-to-month agreements with no long-term lock-ins."
                }
              },
              {
                "@type": "Question",
                "name": "Is Trydentt insured for commercial properties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Trydentt carries full commercial general liability insurance and workers' compensation coverage, protecting your business and property at all times."
                }
              }
            ]
          }
        `}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        {/* Fresh Breeze Animation */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="breeze-overlay animate-breeze" />
          <div className="breeze-overlay animate-breeze delay-4000" style={{ animationDelay: '4s' }} />
        </div>

        {/* Premium Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8 relative">
              <Building2 className="w-4 h-4" />
              <span>Professional Commercial Solutions</span>
              <Sparkle className="text-indigo-400 w-4 h-4 -top-2 -right-2" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] relative">
              Pristine Workspaces, <span className="text-indigo-600">Professional Excellence.</span>
              <Sparkle className="text-indigo-300 w-6 h-6 -top-6 -left-4" />
              <Sparkle className="text-indigo-200 w-4 h-4 bottom-0 -right-8" />
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Your workspace is a reflection of your brand. Trydentt delivers professional commercial cleaning and janitorial services in London, Ontario — consistent, fully insured, and tailored to your business hours.
            </p>

            <div className="flex flex-col items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link
                  to="/quote?niche=commercial"
                  className="relative z-10 inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-300"
                  onClick={() => typeof window.gtag === 'function' && window.gtag('event', 'cta_click', { event_label: 'hero_request_proposal', page: 'commercial' })}
                >
                  <span>Request a Custom Proposal</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="absolute -inset-1 bg-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PAS Framework Section - Redesigned Bento Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Fresh Breeze Animation */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="breeze-overlay animate-breeze opacity-30" style={{ animationDuration: '12s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl font-bold mb-4 font-display text-slate-900">
              The Difference is in the Detail
              <Sparkle className="text-indigo-200 w-5 h-5 -top-4 right-1/4" />
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the Trydentt standard — reliable commercial cleaning across London and Southwestern Ontario. From office cleaning and carpet care to post-event cleanup, we keep your business spotless so your team can focus on what they do best.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[240px]">
            {/* Problem 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
              className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between transition-all duration-500"
            >
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Unreliable Janitors</h3>
                <p className="text-slate-500 text-sm">Late arrivals and missed trash bins affecting your office environment and employee morale.</p>
              </div>
            </motion.div>

            {/* Problem 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
              className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between transition-all duration-500"
            >
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Poor First Impressions</h3>
                <p className="text-slate-500 text-sm">Dusty lobbies and smudged windows affecting client trust and your brand image.</p>
              </div>
            </motion.div>

            {/* Solution - Large Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(79, 70, 229, 0.2)', borderColor: 'rgba(79, 70, 229, 0.4)' }}
              className="md:row-span-2 p-10 rounded-[2.5rem] bg-indigo-600 text-white flex flex-col justify-between relative overflow-hidden group border border-transparent transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6 font-display leading-tight">The Trydentt Business Standard</h3>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  - Consistent, high-quality sanitation tailored to your business's needs<br />
                  - We work when you don't, ensuring a safe and clean environment
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <Link to="/quote?niche=commercial" className="inline-flex items-center space-x-2 text-white font-bold group/link">
                  <span>Get a Proposal Today</span>
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </motion.div>

            {/* Problem 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
              className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between transition-all duration-500"
            >
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Liability Risks</h3>
                <p className="text-slate-500 text-sm">Uninsured cleaners posing a risk to your business and property.</p>
              </div>
            </motion.div>

            {/* Solution 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.4 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.05)', borderColor: 'rgba(79, 70, 229, 0.2)' }}
              className="group p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col justify-between transition-all duration-500"
            >
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Fully Insured</h3>
                <p className="text-slate-500 text-sm">Total liability and workers comp coverage for your protection.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Services Breakdown Section */}
      <section id="services" className="py-24 bg-indigo-50 font-sans relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl font-bold mb-6 font-display text-slate-900 relative inline-block pb-4">
              Commercial Services
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-full" />
              <span className="absolute bottom-0 left-1/2 translate-x-4 w-3 h-1 bg-slate-800 rounded-full" />
              <Sparkle className="text-indigo-300 w-4 h-4 -top-4 -right-8" />
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              Professional office cleaning, janitorial services, carpet and upholstery care, window cleaning, and post-event restoration — tailored to your London, Ontario business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercialServices.map((service, idx) => (
              <ServiceCard 
                key={idx}
                service={service}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Visual Proof Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="breeze-overlay animate-breeze opacity-40" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-4xl font-bold mb-8 font-display text-slate-900">
                Visual Proof of Excellence
                <Sparkle className="text-indigo-300 w-6 h-6 -top-8 left-0" />
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                See the Trydentt difference in action. From trashed restaurant kitchens to spotless commercial floors, our London cleaning team maintains the highest standards of commercial hygiene.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Professional Standards</h3>
                    <p className="text-sm text-slate-500">Partnering with local businesses to maintain pristine environments.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Fully Insured & Bonded</h3>
                    <p className="text-sm text-slate-500">Total liability coverage for your business protection.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Before/After Slider */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video group"
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/images/commercial-before.jpg"
                  width={800}
                  height={450}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  alt="Commercial kitchen floor covered in debris before Trydentt cleaning service"

                />
              </div>
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src="/images/commercial-after.jpg"
                  width={800}
                  height={450}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  alt="Spotless commercial kitchen floor after Trydentt janitorial cleaning service"

                />
              </div>
              
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-4 bg-slate-300 rounded-full" />
                    <div className="w-0.5 h-4 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                aria-label="Slide to compare before and after commercial cleaning results"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
              
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10">Before</div>
              <div className="absolute bottom-6 right-6 bg-indigo-600/80 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10">After</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Estimate Calculator Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickCalculator />
        </div>
      </section>

      {/* Service Areas Internal Links */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Commercial Cleaning Across Southwestern Ontario</h2>
          <p className="text-slate-500 mb-8 max-w-2xl mx-auto">We serve businesses in London and all surrounding communities with consistent, professional-grade cleaning.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/london-ontario-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">London, ON</Link>
            <Link to="/st-thomas-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">St. Thomas</Link>
            <Link to="/woodstock-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Woodstock</Link>
            <Link to="/strathroy-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Strathroy</Link>
            <Link to="/ingersoll-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Ingersoll</Link>
            <Link to="/tillsonburg-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Tillsonburg</Link>
            <Link to="/aylmer-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Aylmer</Link>
            <Link to="/dorchester-cleaning" className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors">Dorchester</Link>
          </div>
        </div>
      </section>

      {/* 6. Low-Friction CTA Form Section */}
      <section id="booking-form" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">Elevate your workspace?</h2>
                <p className="text-xl text-indigo-100 mb-10">
                  Join businesses across London, St. Thomas, Woodstock, and Southwestern Ontario who trust Trydentt. Get a custom commercial cleaning proposal in less than two hours.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">Custom proposals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">Fully insured & bonded</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Request a Proposal</h3>
                <p className="text-slate-600 mb-8">
                  Get a customized cleaning plan for your business. Fast, professional, and tailored to your needs.
                </p>
                <Link 
                  to="/quote?niche=commercial" 
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Request My Proposal</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
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

export default Commercial;
