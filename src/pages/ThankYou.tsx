import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import Sparkle from '../components/Sparkle';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

const ThankYou: React.FC = () => {
  useEffect(() => {
    // Meta Pixel conversion
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead');
    }
    // GA4 conversion event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'conversion',
        event_label: 'form_submission',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <Helmet>
        <title>Thank You | Trydentt Cleaning Services</title>
        <meta name="description" content="Thank you for your booking request. Our team will contact you shortly to confirm your cleaning appointment." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background Animations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="breeze-overlay animate-breeze" />
        <div className="breeze-overlay animate-breeze delay-4000" style={{ animationDelay: '4s' }} />
      </div>

      {/* Premium Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card max-w-2xl mx-auto p-12 md:p-16 text-center rounded-[3rem] relative overflow-hidden"
        >
          {/* Success Icon Animation */}
          <div className="mb-8 relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600 relative z-10"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 bg-indigo-400 rounded-full z-0"
            />
            <div className="absolute -top-2 -right-2">
              <Sparkle className="text-indigo-400 w-6 h-6 animate-sparkle" />
            </div>
            <div className="absolute bottom-0 -left-2">
              <Sparkle className="text-indigo-300 w-4 h-4 animate-sparkle" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
              Thank You for Your Request!
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              We have received your details and will contact you shortly to confirm your cleaning slot.
            </p>

            <Link 
              to="/" 
              className="btn-primary inline-flex items-center space-x-2 group"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
