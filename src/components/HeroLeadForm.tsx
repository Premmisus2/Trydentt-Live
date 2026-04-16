import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Shield, Star } from 'lucide-react';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

const GHL_WEBHOOK_URL = import.meta.env.VITE_GHL_QUOTE_WEBHOOK;

const HeroLeadForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errors, setErrors] = useState({ phone: '', postalCode: '' });
  const [submitting, setSubmitting] = useState(false);

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!value) return 'Phone number is required';
    if (digits.length !== 10) return 'Please enter a 10-digit phone number.';
    return '';
  };

  const validatePostalCode = (value: string) => {
    const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!value) return 'Postal code is required';
    if (!regex.test(value)) return 'Please enter a valid Canadian postal code (e.g., N6A 1A1).';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    const postalErr = validatePostalCode(postalCode);
    if (phoneErr || postalErr) {
      setErrors({ phone: phoneErr, postalCode: postalErr });
      return;
    }
    if (!GHL_WEBHOOK_URL) {
      console.error('VITE_GHL_QUOTE_WEBHOOK is not configured');
      alert('Submission temporarily unavailable. Please call (519) 871-3368.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: `+1 ${phone}`,
          postalCode,
          source: 'Landing Page — London Ontario (Hero Form)',
          niche: 'residential',
          utm_source: searchParams.get('utm_source') || '',
          utm_medium: searchParams.get('utm_medium') || '',
          utm_campaign: searchParams.get('utm_campaign') || '',
          utm_term: searchParams.get('utm_term') || '',
          utm_content: searchParams.get('utm_content') || '',
          landing_page: window.location.href,
        }),
      });
      if (response.ok) {
        navigate('/thank-you');
      } else {
        setSubmitting(false);
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      setSubmitting(false);
      alert('Network error. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-slate-200 relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-4">
          <Sparkles className="w-3 h-3" />
          <span>FREE QUOTE · NO OBLIGATION</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-display leading-tight">
          Get Your Free Residential Cleaning Quote
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Response within 2 hours. No spam, ever.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
            <div className="flex space-x-2">
              <div className="flex items-center px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium whitespace-nowrap">
                🇨🇦 +1
              </div>
              <input
                type="tel"
                required
                placeholder="519-555-5555"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                onBlur={(e) => setErrors({ ...errors, phone: validatePhone(e.target.value) })}
                className={`flex-1 min-w-0 px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Postal Code</label>
            <input
              type="text"
              required
              placeholder="N6A 1A1"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value.toUpperCase());
                if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
              }}
              onBlur={(e) => setErrors({ ...errors, postalCode: validatePostalCode(e.target.value) })}
              className={`w-full px-4 py-3 rounded-xl border ${errors.postalCode ? 'border-red-400' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1 font-bold">{errors.postalCode}</p>}
          </div>

          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Get My Quote</span>
            )}
          </motion.button>

          <div className="flex items-center justify-around pt-3 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium">Eco-friendly</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium">Fully insured</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-medium">5-star rated</span>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 pt-1">
            Or call <a href="tel:+15198713368" className="text-indigo-600 font-semibold hover:underline">(519) 871-3368</a>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default HeroLeadForm;
