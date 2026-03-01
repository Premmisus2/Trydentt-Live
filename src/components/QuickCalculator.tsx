import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Sparkles, Home, Building2, Check, ArrowDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Counter from './Counter';

const servicesData = {
  residential: [
    { name: 'General House Cleaning', multiplier: 0.15 },
    { name: 'Deep Cleaning', multiplier: 0.25 },
    { name: 'Move-In/Move-Out', multiplier: 0.22 },
    { name: 'Post-Construction', multiplier: 0.30 },
    { name: 'Eco-Friendly Cleaning', multiplier: 0.18 },
    { name: 'Seasonal Cleaning', multiplier: 0.20 },
  ],
  commercial: [
    { name: 'Office Cleaning', multiplier: 0.12 },
    { name: 'Carpet & Upholstery', multiplier: 0.18 },
    { name: 'Window & Glass', multiplier: 0.10 },
    { name: 'Post-Event Cleaning', multiplier: 0.35 },
    { name: 'Janitorial Services', multiplier: 0.15 },
    { name: 'Retail Store Cleaning', multiplier: 0.20 },
  ]
};

const QuickCalculator: React.FC<{ onComplete?: (data: any) => void }> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [niche, setNiche] = useState<'residential' | 'commercial' | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [sqft, setSqft] = useState(1500);
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const nicheParam = searchParams.get('niche');
    if (nicheParam) {
      const normalizedNiche = nicheParam.toLowerCase();
      if (normalizedNiche === 'residential' || normalizedNiche === 'commercial') {
        setNiche(normalizedNiche);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (niche && selectedService) {
      const serviceList = servicesData[niche];
      const service = serviceList.find(s => s.name === selectedService);
      if (service) {
        const base = sqft * service.multiplier;
        setEstimate({
          min: Math.floor(base * 0.9),
          max: Math.ceil(base * 1.1)
        });
      }
    }
  }, [niche, selectedService, sqft]);

  const handleLockInPrice = () => {
    if (niche && selectedService) {
      if (onComplete) {
        onComplete({
          niche,
          service: selectedService,
          sqft,
          min: estimate.min,
          max: estimate.max
        });
      } else {
        const params = new URLSearchParams({
          niche,
          service: selectedService,
          sqft: sqft.toString(),
          min: estimate.min.toString(),
          max: estimate.max.toString()
        });
        navigate(`/quote?${params.toString()}`);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2.5rem] p-8 lg:p-12 max-w-5xl mx-auto relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Fresh Breeze Animation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="breeze-overlay animate-breeze opacity-20" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-12">
           <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold relative mb-4">
            <Calculator className="w-4 h-4" />
            <span>Instant Estimate</span>
            <div className="absolute -top-1 -right-1 text-indigo-400 animate-sparkle">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">
            Get Your Price in Seconds
          </h3>
          <p className="text-slate-500 mt-2">Select your service to see an instant estimate.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Steps */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* Step 1: Niche Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">1</span>
                        Choose Your Space
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => { setNiche('residential'); setSelectedService(null); }}
                            className={`relative overflow-hidden group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 ${niche === 'residential' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'}`}
                        >
                            <Home className={`w-8 h-8 ${niche === 'residential' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
                            <span className="font-bold">Residential</span>
                            {niche === 'residential' && (
                                <motion.div layoutId="check" className="absolute top-3 right-3 text-indigo-600">
                                    <Check className="w-5 h-5" />
                                </motion.div>
                            )}
                        </button>
                        <button
                            onClick={() => { setNiche('commercial'); setSelectedService(null); }}
                            className={`relative overflow-hidden group p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 ${niche === 'commercial' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'}`}
                        >
                            <Building2 className={`w-8 h-8 ${niche === 'commercial' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
                            <span className="font-bold">Commercial</span>
                            {niche === 'commercial' && (
                                <motion.div layoutId="check" className="absolute top-3 right-3 text-indigo-600">
                                    <Check className="w-5 h-5" />
                                </motion.div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Step 2: Service Selection */}
                <AnimatePresence>
                    {niche && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-4 overflow-hidden"
                        >
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
                                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">2</span>
                                Select Service
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {servicesData[niche].map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => setSelectedService(s.name)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${selectedService === s.name ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step 3: Square Footage */}
                <AnimatePresence>
                    {niche && selectedService && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                            className="space-y-4 overflow-hidden"
                        >
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">3</span>
                                    Square Footage
                                </label>
                                <span className="text-2xl font-bold text-indigo-600 font-mono bg-indigo-50 px-3 py-1 rounded-lg">{sqft.toLocaleString()} sqft</span>
                            </div>
                            <input 
                                type="range" 
                                min="500" 
                                max="10000" 
                                step="100"
                                value={sqft}
                                onChange={(e) => setSqft(parseInt(e.target.value))}
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>500 sqft</span>
                                <span>10,000+ sqft</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Column: Estimate Display */}
            <div className="lg:col-span-5">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center space-y-8 relative overflow-hidden h-full flex flex-col justify-center shadow-2xl">
                     {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-slate-900 opacity-100" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
                    
                    <div className="relative z-10">
                        <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-xs mb-4">Estimated Price Range</p>
                        
                        <AnimatePresence mode="wait">
                            {niche && selectedService ? (
                                <motion.div
                                    key="price"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="flex items-center justify-center space-x-2 text-white mb-2"
                                >
                                    <span className="text-4xl font-light opacity-50">$</span>
                                    <span className="text-6xl md:text-7xl font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                                        <Counter value={estimate.min} duration={1} />
                                    </span>
                                    <span className="text-2xl font-light opacity-50 self-end mb-4">-</span>
                                    <span className="text-4xl font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 self-end mb-1">
                                        <Counter value={estimate.max} duration={1} />
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-slate-600 py-8"
                                >
                                    <div className="text-5xl font-bold text-slate-700/30">---</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-slate-400 text-sm italic mb-8">
                            {niche && selectedService ? "Based on standard market rates. Final price may vary." : "Select options to see price."}
                        </p>
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLockInPrice}
                            disabled={!niche || !selectedService}
                            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2 ${niche && selectedService ? 'bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            <span>Lock in this Price</span>
                            <ArrowDown className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickCalculator;
