import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calculator, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSmartEstimate } from '../services/geminiService';
import { QuoteRequest, GeminiResponse } from '../types';
import QuickCalculator from '../components/QuickCalculator';

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
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    const niche = searchParams.get('niche');
    const service = searchParams.get('service');
    const sqft = searchParams.get('sqft');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    if (niche && service && min && max) {
      setResult({
        estimate: `$${min} - $${max}`,
        recommendations: [
          `Service: ${service} (${niche})`,
          `Size: ${sqft} sqft`,
          "Professional Equipment Included",
          "Satisfaction Guaranteed"
        ]
      });
      setShowBooking(true);
    } else {
      setShowBooking(false);
      setResult(null);
    }
  }, [searchParams]);

  const handleCalculatorComplete = (data: any) => {
    setResult({
      estimate: `$${data.min} - $${data.max}`,
      recommendations: [
        `Service: ${data.service} (${data.niche})`,
        `Size: ${data.sqft} sqft`,
        "Professional Equipment Included",
        "Satisfaction Guaranteed"
      ]
    });
    setShowBooking(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://services.leadconnectorhq.com/hooks/a9j6O8eXLyQk7lKBkZFD/webhook-trigger/0f0403d5-4cf8-4fe0-ac74-28de4913e0fc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          estimate: result?.estimate,
          serviceDetails: result?.recommendations,
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
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
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
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={bookingData.zip}
                    onChange={(e) => setBookingData({ ...bookingData, zip: e.target.value })}
                  />
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
