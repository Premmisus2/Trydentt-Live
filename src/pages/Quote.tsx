import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calculator, CheckCircle2, Loader2, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSmartEstimate } from '../services/geminiService';
import { QuoteRequest, GeminiResponse } from '../types';
import QuickCalculator from '../components/QuickCalculator';

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/a9j6O8eXLyQk7lKBkZFD/webhook-trigger/220c1782-0e8e-4072-a736-9b848a391f78';

const Quote: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    phonePrefix: '+1',
    address: '',
    city: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    postalCode: ''
  });

  useEffect(() => {
    const niche = searchParams.get('niche');
    const service = searchParams.get('service');
    const sqft = searchParams.get('sqft');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    if (niche && service && min && max) {
      setResult({
        estimate: `$${min} - ${max}`,
        recommendations: [
          `Service: ${service} (${niche})`,
          `Size: ${sqft} sqft`,
          "Professional Equipment Included",
          "Satisfaction Guaranteed"
        ],
        niche: niche as 'residential' | 'commercial',
        service: service,
        sqft: sqft ? parseInt(sqft) : undefined,
        minPrice: parseInt(min),
        maxPrice: parseInt(max)
      });
      setShowBooking(true);
    } else {
      setShowBooking(false);
      setResult(null);
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!regex.test(email)) {
      if (!email.includes('@')) return `Please include an '@' in the email address. '${email}' is missing an '@'.`;
      return "Please enter a valid email address.";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/;
    const digits = phone.replace(/\D/g, '');
    if (!phone) return "Phone number is required";
    if (digits.length !== 10) return "Please enter a 10-digit phone number.";
    return "";
  };

  const validatePostalCode = (code: string) => {
    // Canadian Postal Code: A1A 1A1 or A1A1A1
    const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    if (!code) return "Postal code is required";
    if (!regex.test(code)) return "Please enter a valid Canadian postal code (e.g., A1A 1A1).";
    return "";
  };

  const handleCalculatorComplete = (data: any) => {
    setResult({
      estimate: `$${data.min} - ${data.max}`,
      recommendations: [
        `Service: ${data.service} (${data.niche})`,
        `Size: ${data.sqft} sqft`,
        "Professional Equipment Included",
        "Satisfaction Guaranteed"
      ],
      niche: data.niche,
      service: data.service,
      sqft: data.sqft,
      minPrice: data.min,
      maxPrice: data.max
    });
    setShowBooking(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(bookingData.email);
    const phoneErr = validatePhone(bookingData.phone);
    const postalErr = validatePostalCode(bookingData.postalCode);

    if (emailErr || phoneErr || postalErr) {
      setErrors({
        email: emailErr,
        phone: phoneErr,
        postalCode: postalErr
      });
      return;
    }

    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          phone: `${bookingData.phonePrefix} ${bookingData.phone}`,
          estimate: result?.estimate,
          serviceDetails: result?.recommendations,
          niche: result?.niche,
          service: result?.service,
          sqft: result?.sqft,
          minPrice: result?.minPrice,
          maxPrice: result?.maxPrice,
          source: 'Website Smart Estimator'
        }),
      });

      if (response.ok) {
        navigate('/thank-you');
      } else {
        console.error('Webhook submission failed');
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!showBooking && (
        <div className="mb-12 min-h-[600px]">
          <QuickCalculator onComplete={handleCalculatorComplete} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {showBooking && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card border-indigo-100 bg-white max-w-2xl mx-auto"
          >
            <div className="flex items-center space-x-2 text-indigo-600 font-bold mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Your Booking</span>
            </div>

            {/* Selected Package Summary */}
            {result && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Your Selected Package</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo-700 font-bold text-lg">{result.estimate}</span>
                </div>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-indigo-600/80 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                  value={bookingData.email}
                  onChange={(e) => {
                    setBookingData({ ...bookingData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  onBlur={(e) => setErrors({ ...errors, email: validateEmail(e.target.value) })}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-start space-x-2 text-xs text-slate-700 max-w-sm"
                    >
                      <div className="bg-orange-500 text-white p-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                      <p>{errors.email}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <div className="flex space-x-2">
                  <div className="relative w-24">
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
                      value={bookingData.phonePrefix}
                      onChange={(e) => setBookingData({ ...bookingData, phonePrefix: e.target.value })}
                    >
                      <option value="+1 ">🇨🇦 +1</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="555-555-5555"
                    className={`flex-1 px-4 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    value={bookingData.phone}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    onBlur={(e) => setErrors({ ...errors, phone: validatePhone(e.target.value) })}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={bookingData.address}
                  onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={bookingData.city}
                    onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="A1A 1A1"
                    className={`w-full px-4 py-2 rounded-lg border ${errors.postalCode ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                    value={bookingData.postalCode}
                    onChange={(e) => {
                      setBookingData({ ...bookingData, postalCode: e.target.value.toUpperCase() });
                      if (errors.postalCode) setErrors({ ...errors, postalCode: '' });
                    }}
                    onBlur={(e) => setErrors({ ...errors, postalCode: validatePostalCode(e.target.value) })}
                  />
                  {errors.postalCode && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.postalCode}</p>}
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quote;
