import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import QuickCalculator from '../components/QuickCalculator';
import Sparkle from '../components/Sparkle';
import Counter from '../components/Counter';
import ServiceCard from '../components/ServiceCard';
import { 
  Shield, Sparkles, Clock, ArrowRight, Star, 
  Home as HomeIcon, AlertCircle, Frown, 
  CheckCircle2, Users, Trophy, Zap, Calendar, 
  Wind, Trash2, LayoutGrid, Send, XCircle
} from 'lucide-react';

const Residential: React.FC = () => {
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
              <HomeIcon className="w-4 h-4" />
              <span>Premium Residential Care</span>
              <Sparkle className="text-indigo-400 w-4 h-4 -top-2 -right-2" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] relative">
              Your Home, Your Sanctuary. <span className="text-indigo-600">Reclaim Your Weekends.</span>
              <Sparkle className="text-indigo-300 w-6 h-6 -top-6 -left-4" />
              <Sparkle className="text-indigo-200 w-4 h-4 bottom-0 -right-8" />
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Stop spending your precious free time scrubbing floors. Trydentt delivers a meticulous, family-safe clean so you can focus on what matters most.
            </p>

            <div className="flex flex-col items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <Link 
                  to="/quote?niche=residential" 
                  className="relative z-10 inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-300"
                >
                  <span>Book Your Home Clean</span>
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
            <p className="text-slate-500 max-w-2xl mx-auto">Why settle for "clean enough" when you can have perfection? We've identified the frustrations and built the solution.</p>
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
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Wasted Weekends</h4>
                <p className="text-slate-500 text-sm">Spending your only free hours scrubbing instead of relaxing with family.</p>
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
                <h4 className="text-xl font-bold text-slate-900 mb-2">Surface Level Clean</h4>
                <p className="text-slate-500 text-sm">Dust hiding in corners and under furniture that you just don't have time for.</p>
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
                <h4 className="text-3xl font-bold mb-6 font-display leading-tight">The Trydentt Home Standard</h4>
                <p className="text-indigo-100 text-lg leading-relaxed">
                  Punctual, precise, and professional. We restore your time and sanity with a meticulous multi-point checklist and a 100% satisfaction guarantee.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <Link to="/quote?niche=residential" className="inline-flex items-center space-x-2 text-white font-bold group/link">
                  <span>Get Started Today</span>
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
                <Frown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Hidden Fees</h4>
                <p className="text-slate-500 text-sm">Surprise costs on your bill that were never discussed upfront.</p>
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

      {/* 3. Services Breakdown Section */}
      <section className="py-24 bg-indigo-50 font-sans relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <h2 className="text-4xl font-bold mb-6 font-display text-slate-900 relative inline-block pb-4">
              Residential Services
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-full" />
              <span className="absolute bottom-0 left-1/2 translate-x-4 w-3 h-1 bg-slate-800 rounded-full" />
              <Sparkle className="text-indigo-300 w-4 h-4 -top-4 -right-8" />
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              Tailored cleaning solutions for every home. From daily maintenance to deep seasonal refreshes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residentialServices.map((service, idx) => (
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
                See the Trydentt difference in action. From kitchen grease to bathroom grime, we restore your home to its original glory.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Dedicated Home Care</h4>
                    <p className="text-sm text-slate-500">We treat your home with the respect and care it deserves.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Family & Pet Safe</h4>
                    <p className="text-sm text-slate-500">100% non-toxic cleaning agents used in every home.</p>
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
                  src="https://picsum.photos/seed/clean-after-home/1200/800" 
                  className="w-full h-full object-cover" 
                  alt="After Cleaning"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src="https://picsum.photos/seed/dirty-before-home/1200/800?grayscale" 
                  className="w-full h-full object-cover" 
                  alt="Before Cleaning"
                  referrerPolicy="no-referrer"
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
              
              <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10">Before</div>
              <div className="absolute bottom-6 right-6 bg-indigo-600/80 backdrop-blur-md text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10">After</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="bg-slate-50 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="breeze-overlay animate-breeze opacity-20" style={{ animationDuration: '15s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-display">
              Home Cleaning Statistics
              <Sparkle className="text-indigo-400 w-4 h-4 -top-2 right-1/3" />
            </h2>
            <div className="w-40 h-0.5 bg-slate-900 mx-auto" />
          </motion.div>
          
          <div className="flex flex-wrap rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="w-full sm:w-1/2 lg:w-1/4 bg-indigo-950 p-12 text-center group hover:bg-indigo-900 transition-colors">
              <div className="mb-6 flex justify-center">
                <LayoutGrid className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
              </div>
              <p className="text-4xl font-bold text-white mb-4 font-mono">
                <Counter value={1800} />+
              </p>
              <div className="w-14 h-0.5 bg-white/80 mx-auto mb-4 group-hover:w-20 transition-all" />
              <p className="text-white/80 text-lg font-medium group-hover:text-white transition-colors">Homes Cleaned</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 bg-indigo-900 p-12 text-center group hover:bg-indigo-800 transition-colors">
              <div className="mb-6 flex justify-center">
                <Users className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
              </div>
              <p className="text-4xl font-bold text-white mb-4 font-mono">
                <Counter value={30} />+
              </p>
              <div className="w-14 h-0.5 bg-white/80 mx-auto mb-4 group-hover:w-20 transition-all" />
              <p className="text-white/80 text-lg font-medium group-hover:text-white transition-colors">Home Specialists</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 bg-indigo-800 p-12 text-center group hover:bg-indigo-700 transition-colors">
              <div className="mb-6 flex justify-center">
                <Trophy className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
              </div>
              <p className="text-4xl font-bold text-white mb-4 font-mono">
                <Counter value={100} />%
              </p>
              <div className="w-14 h-0.5 bg-white/80 mx-auto mb-4 group-hover:w-20 transition-all" />
              <p className="text-white/80 text-lg font-medium group-hover:text-white transition-colors">Satisfaction Rate</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 bg-indigo-700 p-12 text-center group hover:bg-indigo-600 transition-colors">
              <div className="mb-6 flex justify-center">
                <Star className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
              </div>
              <p className="text-4xl font-bold text-white mb-4 font-mono">
                <Counter value={450} />+
              </p>
              <div className="w-14 h-0.5 bg-white/80 mx-auto mb-4 group-hover:w-20 transition-all" />
              <p className="text-white/80 text-lg font-medium group-hover:text-white transition-colors">Happy Families</p>
            </div>
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
                <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">Ready for a spotless home?</h2>
                <p className="text-xl text-indigo-100 mb-10">
                  Join 1,800+ happy families. Fill out this simple form and we'll get back to you with a custom plan in less than 2 hours.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">No hidden fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    <span className="text-sm font-medium">Eco-friendly products</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Started in Seconds</h3>
                <p className="text-slate-600 mb-8">
                  Get a precise, AI-powered estimate for your home instantly. No phone calls required.
                </p>
                <Link 
                  to="/quote?niche=residential" 
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center space-x-2 group"
                >
                  <span>Get My Free Quote</span>
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

export default Residential;
