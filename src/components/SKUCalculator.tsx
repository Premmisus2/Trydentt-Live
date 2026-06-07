import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calculator, Check, Sparkles } from 'lucide-react';
import {
  ADDONS,
  ADDON_BY_ID,
  FREQUENCY_MULT,
  SKU_META,
  type Frequency,
  type QuoteState,
  type SKUId,
  calculateQuote,
  defaultStateFor,
} from '../lib/skus';

interface SKUCalculatorProps {
  sku: Exclude<SKUId, 'class-a-office'>;
  onSubmit?: (state: QuoteState, subtotal: number) => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4];
const BATHROOM_OPTIONS = [1, 1.5, 2, 2.5, 3];

const SKUCalculator: React.FC<SKUCalculatorProps> = ({ sku, onSubmit }) => {
  const meta = SKU_META[sku];
  const navigate = useNavigate();
  const [state, setState] = useState<QuoteState>(() => defaultStateFor(sku));
  const [contact, setContact] = useState({ name: '', phone: '', email: '', postalCode: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quote = useMemo(() => calculateQuote(state), [state]);

  const visibleAddons = useMemo(
    () => ADDONS.filter(a => !a.includedIn?.includes(sku) || a.price > 0),
    [sku],
  );

  const toggleAddon = (id: string) =>
    setState(s => ({
      ...s,
      addons: s.addons.includes(id) ? s.addons.filter(x => x !== id) : [...s.addons, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.phone) {
      setSubmitError('Name and phone are required.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      ...contact,
      niche: 'residential',
      service: meta.productName,
      source: 'sku-calculator',
      landing_page: typeof window !== 'undefined' ? window.location.href : undefined,
      minPrice: quote.subtotal,
      maxPrice: quote.subtotal,
      estimate: `$${quote.subtotal}`,
      // SKU-specific fields — consumed by /api/lead.ts + GHL webhook fan-out.
      sku,
      bedrooms: state.bedrooms,
      bathrooms: state.bathrooms,
      addons: state.addons,
      frequency: state.frequency,
      annualLockIn: state.annualLockIn ?? false,
      serviceDetails: state.addons.map(id => ADDON_BY_ID[id]?.label).filter(Boolean) as string[],
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error('Submission failed.');

      // Stash event_id + quote context for /thank-you to fire deduped Meta Pixel + GA4 + Google Ads conversion events.
      // ThankYou.tsx reads these and fires generate_lead + ads_conversion_Request_quote_1.
      if (typeof window !== 'undefined') {
        if (json.eventId) sessionStorage.setItem('trydentt_lead_event_id', json.eventId);
        sessionStorage.setItem('trydentt_lead_sku', sku);
        sessionStorage.setItem('trydentt_lead_subtotal', String(quote.subtotal));
        sessionStorage.setItem('trydentt_lead_product', meta.productName);
        // Clear any stale FIRED guard from a previous session so ThankYou actually fires for this submit.
        sessionStorage.removeItem('trydentt_lead_fired');
      }

      onSubmit?.(state, quote.subtotal);
      navigate('/thank-you');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-[2.5rem] p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-4">
            <Calculator className="w-4 h-4" />
            <span>Live Quote — Locked in 60 seconds</span>
            <Sparkles className="w-3 h-3 animate-sparkle" />
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-display">
            Get your locked-in price
          </h3>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">{meta.guarantee}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column: step-by-step */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8">
            {/* Step 1: bedrooms */}
            <StepHeader number={1} label="Bedrooms" />
            <div className="flex flex-wrap gap-3">
              {BEDROOM_OPTIONS.map(n => (
                <PillButton
                  key={n}
                  active={state.bedrooms === n}
                  onClick={() => setState(s => ({ ...s, bedrooms: n }))}
                >
                  {n === 4 ? '4+' : n}
                </PillButton>
              ))}
            </div>

            {/* Step 2: bathrooms */}
            <StepHeader number={2} label="Bathrooms" />
            <div className="flex flex-wrap gap-3">
              {BATHROOM_OPTIONS.map(n => (
                <PillButton
                  key={n}
                  active={state.bathrooms === n}
                  onClick={() => setState(s => ({ ...s, bathrooms: n }))}
                >
                  {n}
                </PillButton>
              ))}
            </div>

            {/* Step 3: frequency (bi-weekly SKU only) */}
            {sku === 'bi-weekly' && (
              <>
                <StepHeader number={3} label="Frequency" />
                <div className="grid grid-cols-2 gap-3">
                  {(['biweekly', 'weekly'] as Frequency[]).map(f => {
                    const mult = FREQUENCY_MULT[f];
                    const label = f === 'biweekly' ? 'Every 2 weeks' : 'Weekly (+20%)';
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setState(s => ({ ...s, frequency: f }))}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          state.frequency === f
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {label}
                        {state.frequency === f && mult > 1 && (
                          <span className="block text-xs font-medium text-slate-500 mt-1">
                            Multiplier ×{mult.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step: annual lock-in toggle (bi-weekly only) */}
            {sku === 'bi-weekly' && (
              <button
                type="button"
                onClick={() => setState(s => ({ ...s, annualLockIn: !s.annualLockIn }))}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                  state.annualLockIn
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                    state.annualLockIn
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {state.annualLockIn && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Lock my rate for 12 months</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Annual commitment = first deep clean FREE ($299 value) + locked rate for the year.
                  </div>
                </div>
              </button>
            )}

            {/* Add-ons */}
            <StepHeader number={sku === 'bi-weekly' ? 4 : 3} label="Add-ons (optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visibleAddons.map(addon => {
                const isIncluded = addon.includedIn?.includes(sku);
                const isActive = state.addons.includes(addon.id) || isIncluded;
                return (
                  <button
                    key={addon.id}
                    type="button"
                    disabled={isIncluded}
                    onClick={() => !isIncluded && toggleAddon(addon.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                      isIncluded
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 cursor-default'
                        : isActive
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isIncluded
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : isActive
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate font-medium">{addon.label}</span>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap ml-2">
                      {isIncluded ? 'INCLUDED' : addon.price === 0 ? 'FREE' : `+$${addon.price}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contact */}
            <StepHeader number={sku === 'bi-weekly' ? 5 : 4} label="Your details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Full name"
                value={contact.name}
                onChange={v => setContact(c => ({ ...c, name: v }))}
                required
              />
              <Input
                placeholder="Phone"
                value={contact.phone}
                onChange={v => setContact(c => ({ ...c, phone: v }))}
                required
              />
              <Input
                placeholder="Email"
                value={contact.email}
                onChange={v => setContact(c => ({ ...c, email: v }))}
              />
              <Input
                placeholder="Postal code"
                value={contact.postalCode}
                onChange={v => setContact(c => ({ ...c, postalCode: v }))}
              />
            </div>
          </div>

          {/* Right column: sticky live total */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-slate-900" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="relative z-10">
                <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                  {sku === 'bi-weekly' ? 'Per-visit price' : 'Your locked-in price'}
                </p>
                <div className="flex items-baseline justify-center text-white mb-2">
                  <span className="text-3xl font-light opacity-60 mr-1">$</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={quote.subtotal}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-6xl md:text-7xl font-bold font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200"
                    >
                      {quote.subtotal}
                    </motion.span>
                  </AnimatePresence>
                  {sku === 'bi-weekly' && (
                    <span className="text-sm text-indigo-200 ml-2">/visit</span>
                  )}
                </div>

                {/* Breakdown */}
                <div className="text-xs text-slate-400 space-y-1 mb-6 border-t border-slate-700 pt-4">
                  <div className="flex justify-between"><span>Base</span><span>${quote.basePrice}</span></div>
                  {quote.bathroomSurcharge > 0 && (
                    <div className="flex justify-between"><span>Bathrooms</span><span>+${quote.bathroomSurcharge}</span></div>
                  )}
                  {quote.addonTotal > 0 && (
                    <div className="flex justify-between"><span>Add-ons</span><span>+${quote.addonTotal}</span></div>
                  )}
                  {sku === 'bi-weekly' && state.frequency === 'weekly' && (
                    <div className="flex justify-between"><span>Weekly upgrade</span><span>×1.20</span></div>
                  )}
                </div>

                {quote.annualBonusNote && (
                  <p className="text-xs text-indigo-200 mb-4 px-2">{quote.annualBonusNote}</p>
                )}

                {submitError && (
                  <p className="text-sm text-red-300 mb-3">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !contact.name || !contact.phone}
                  className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
                    submitting || !contact.name || !contact.phone
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-white text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span>{submitting ? 'Reserving…' : meta.ctaLabel}</span>
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <p className="text-xs text-slate-400 mt-3">
                  No payment required. We call within 24h to confirm.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const StepHeader: React.FC<{ number: number; label: string }> = ({ number, label }) => (
  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs mr-2">
      {number}
    </span>
    {label}
  </label>
);

const PillButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-w-[3rem] px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
      active
        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
    }`}
  >
    {children}
  </button>
);

const Input: React.FC<{
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}> = ({ placeholder, value, onChange, required }) => (
  <input
    type="text"
    placeholder={placeholder + (required ? ' *' : '')}
    value={value}
    onChange={e => onChange(e.target.value)}
    className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
  />
);

export default SKUCalculator;
