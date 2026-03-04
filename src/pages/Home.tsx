import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useRef } from 'react';
import QuickCalculator from '../components/QuickCalculator';
import Sparkle from '../components/Sparkle';
import WhyChooseUs from '../components/WhyChooseUs';
import ServiceCard from '../components/ServiceCard';
import { 
  Shield, Sparkles, Clock, ArrowRight, Star, 
  Home as HomeIcon, Building2, AlertCircle, Frown, Smile, DollarSign,
  CheckCircle2, Trophy, Zap, Calendar, 
  Wind, Trash2, GlassWater, PartyPopper, 
  Briefcase, Store, MapPin, Send, XCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial'>('residential');
  const [sliderPosition, setSliderPosition] = useState(50);

  const residentialServices = [
    { 
      name: 'General House Cleaning', 
      desc: 'Professional maintenance for your daily living space.', 
      details: 'Includes dusting, vacuuming, mopping, and sanitizing all surfaces. We focus on high-touch areas to ensure a healthy living environment for you and your family.',
      icon: <HomeIcon className="w-6 h-6" /> 
    },
    { 
      name: 'Deep Cleaning', 
      desc: 'A thorough, top-to-bottom scrub for every corner.', 
      details: 'A comprehensive clean that targets neglected areas. We move furniture, clean inside appliances, and scrub grout to restore your home\'s original sparkle.',
      icon: <Sparkles className="w-6 h-6" /> 
    },
    { 
      name: 'Move-In/Move-Out', 
      desc: 'Seamless transitions with a spotless new beginning.', 
      details: 'Ensure you get your deposit back or step into a fresh new home. We handle everything from baseboards to ceiling fans, leaving no trace behind.',
      icon: <Zap className="w-6 h-6" /> 
    },
    { 
      name: 'Post-Construction', 
      desc: 'Removing dust and debris after your renovation.', 
      details: 'We specialize in removing fine dust, drywall residue, and construction debris. Our team uses HEPA filtration to ensure the air is as clean as the surfaces.',
      icon: <Trash2 className="w-6 h-6" /> 
    },
    { 
      name: 'Eco-Friendly Cleaning', 
      desc: 'Non-toxic solutions for a healthy, green home.', 
      details: 'We use only EPA-certified, plant-based products that are tough on dirt but safe for pets and children. Breathe easy knowing your home is toxin-free.',
      icon: <Wind className="w-6 h-6" /> 
    },
    { 
      name: 'Seasonal Cleaning', 
      desc: 'Refreshing your space for the changing year.', 
      details: 'Prepare for the holidays or refresh for spring. Our seasonal packages are designed to tackle specific challenges brought by changing weather.',
      icon: <Calendar className="w-6 h-6" /> 
    },
  ];

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
              <Sparkles className="w-4 h-4" />
              <span>New Standard of Professional Hygiene</span>
              <Sparkle className="text-indigo-400 w-4 h-4 -top-2 -right-2" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] relative">
              Modern Cleaning for <span className="text-indigo-600">Modern Lives.</span>
              <Sparkle className="text-indigo-300 w-6 h-6 -top-6 -left-4" />
              <Sparkle className="text-indigo-200 w-4 h-4 bottom-0 -right-8" />
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Trydentt Cleaning Services delivers a meticulous, eco-friendly clean for your home or business. Experience a new standard of professional hygiene.
            </p>

            <div className="flex flex-col items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link 
                  to="/quote" 
                  className="relative z-10 inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-300"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              </motion.div>
              
              <div className="mt-4 flex items-center space-x-4 text-slate-400 text-xs font-medium">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-indigo-500 mr-1" />
                  100% Satisfaction Guarantee
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-indigo-500 mr-1" />
                  No Hidden Fees
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                    className="w-10 h-10 rounded-full border-2 border-white"
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-left text-sm">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-500 font-medium">4.9/5 from multiple local reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-3xl -z-10" />
      </section>

      {/* 1. Clear Lanes Selection */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-xl p-10 transition-all hover:border-indigo-300"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <HomeIcon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 font-display">Residential Cleaning</h3>
                <p className="text-slate-600 mb-8 text-lg">Premium care for your residence from apartments to houses, we handle it all with meticulous detail.</p>
                <Link to="/residential" className="btn-primary inline-flex items-center space-x-2">
                  <span>Explore Home Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-xl p-10 transition-all hover:border-indigo-500"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-slate-800 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 font-display">Commercial Cleaning</h3>
                <p className="text-slate-400 mb-8 text-lg">Professional hygiene standards for your business, dining, offices, and industrial spaces kept pristine.</p>
                <Link to="/commercial" className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 hover:-translate-y-0.5 hover:scale-105 shadow-lg transition-all flex items-center justify-center space-x-2 w-fit">
                  <span>Business Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PAS Framework Section - Redesigned Bento Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Fresh Breeze Animation */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="breeze-overlay animate-breeze opacity-30" style={{ animationDuration: '12s' }} />
        </div>
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

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
            <p className="text-slate-500 max-w-2xl mx-auto">Experience the 'Trydentt' standard. We provide a consistent service tailored to your schedule, ensuring a spotless environment on a weekly basis.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
            {/* Problem 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
              className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between transition-all duration-500"
            >
              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Unreliable Service</h4>
                <p className="text-slate-500 text-sm">No-shows and late arrivals that disrupt your entire day.</p>
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
                <h4 className="text-xl font-bold text-slate-900 mb-2">Missed Spots</h4>
                <p className="text-slate-500 text-sm">Finding yourself cleaning after the "professionals" have left.</p>
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
                <h4 className="text-3xl font-bold mb-6 font-display leading-tight">The Trydentt Standard</h4>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  Punctual, precise, and professional. We restore your time and sanity with a meticulous multi-point checklist and a 100% satisfaction guarantee.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <Link to="/quote" className="inline-flex items-center space-x-2 text-white font-bold group/link">
                  <span>Get Started Today</span>
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              {/* Decorative Glow */}
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
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Affordable Excellence</h4>
                <p className="text-slate-500 text-sm">High standards without inflated costs.</p>
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
                <h4 className="text-xl font-bold text-slate-900 mb-2">Zero Stress</h4>
                <p className="text-slate-500 text-sm">A spotless space, every single time. No management required.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* 3. Services Breakdown Section - Circle Expansion Style */}
      <section className="py-24 bg-indigo-50 font-sans relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl font-bold mb-6 font-display text-slate-900 relative inline-block pb-4">
              Exclusive Services
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-full" />
              <span className="absolute bottom-0 left-1/2 translate-x-4 w-3 h-1 bg-slate-800 rounded-full" />
              <Sparkle className="text-indigo-300 w-4 h-4 -top-4 -right-8" />
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              We provide meticulous cleaning solutions tailored for every environment. Select a category to explore our specialized offerings.
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-sm">
              <button 
                onClick={() => setActiveTab('residential')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'residential' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Residential
              </button>
              <button 
                onClick={() => setActiveTab('commercial')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'commercial' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Commercial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="contents"
              >
                {(activeTab === 'residential' ? residentialServices : commercialServices).map((service, idx) => (
                  <ServiceCard 
                    key={`${activeTab}-${service.name}`}
                    service={service}
                    index={idx}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Visual Proof Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Fresh Breeze Animation */}
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
                Don't just take our word for it. See the Trydentt difference in action. From neglected fixtures to pristine surfaces, we restore every detail to its original glory.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Uncompromising Quality</h4>
                    <p className="text-sm text-slate-500">We deliver meticulous results that speak for themselves.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">100% Satisfaction Guarantee</h4>
                    <p className="text-sm text-slate-500">If you're not happy, we return within 24 hours to fix it.</p>
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
                  src="https://i.imgur.com/qpkTEco.jpg" 
                  className="w-full h-full object-cover" 
                  alt="After Cleaning"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 right-6 bg-indigo-600/90 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider shadow-lg">
                  AFTER
                </div>
              </div>
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src="https://i.imgur.com/BLgbuHK.jpg" 
                  className="w-full h-full object-cover" 
                  alt="Before Cleaning"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-6 bg-slate-800/90 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider shadow-lg">
                  BEFORE
                </div>
              </div>
              
              {/* Slider Handle */}
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
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
                <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">Ready for a cleaner space?</h2>
                <p className="text-xl text-indigo-100 mb-10">
                  Join our list of happy clients. Fill out this simple form and we'll get back to you with a custom plan in less than 2 hours.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">No hidden fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">Fully insured</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Your Free Quote</h3>
                <p className="text-slate-600 mb-8">
                  Ready to experience the difference? Get a personalized estimate in seconds.
                </p>
                <Link 
                  to="/quote" 
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Start My Quote</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            {/* Abstract shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
