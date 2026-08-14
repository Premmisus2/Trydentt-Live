import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Check, Star, Shield, Building2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Class-A Office Standard landing page. Different ICP and flow than the 3 residential SKUs.
// Form is a free 12-Point Audit booking, NOT a flat-rate calculator — commercial pricing
// is generated post-walkthrough from sqft + frequency + scope.

const BUILDING_TYPES = ['Office', 'Retail', 'Medical / Dental', 'Industrial / Warehouse', 'Other'];
const FREQUENCIES = ['3x / week', '5x / week', '7x / week', 'Custom'];
const CURRENT_CLEANER = ['DIY / no service', 'In-house janitorial staff', 'Existing commercial service'];

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

const Commercial: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    role: '',
    phone: '',
    email: '',
    sqft: '',
    buildingType: 'Office',
    frequency: '5x / week',
    currentCleaner: 'Existing commercial service',
    preferredAuditDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.contactName || !form.phone) {
      setSubmitError('Business name, contact name, and phone are required.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const eventId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : undefined;

    const payload = {
      name: form.contactName,
      phone: form.phone,
      email: form.email,
      niche: 'commercial',
      service: 'Class-A Office Standard',
      sku: 'class-a-office' as const,
      source: 'commercial-audit-form',
      landing_page: typeof window !== 'undefined' ? window.location.href : undefined,
      serviceDetails: [
        `Business: ${form.businessName}`,
        `Role: ${form.role}`,
        `Sqft: ${form.sqft}`,
        `Building: ${form.buildingType}`,
        `Frequency: ${form.frequency}`,
        `Current cleaner: ${form.currentCleaner}`,
        `Preferred audit: ${form.preferredAuditDate}`,
      ],
      event_id: eventId,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error('Submission failed.');
      if (eventId) {
        sessionStorage.setItem('trydentt_lead_event_id', json?.eventId || eventId);
      }
      setSubmitted(true);
      navigate('/thank-you');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Commercial Office Cleaning London ON — Class-A Office Standard | Trydentt</title>
        <meta
          name="description"
          content="Class-A Office Standard commercial cleaning for London businesses where appearance is part of revenue. Free 12-Point Office Cleanliness Audit. Insured and bonded."
        />
        <link rel="canonical" href="https://www.trydenttcleaning.ca/commercial" />
        <meta property="og:title" content="Class-A Office Standard — Trydentt Cleaning London" />
        <meta property="og:description" content="Commercial cleaning for London offices where appearance is part of revenue. Free 12-Point Audit." />
        <meta property="og:url" content="https://trydenttcleaning.ca/commercial" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-50 pt-12 pb-20">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold mb-6 uppercase tracking-wider"
          >
            <Sparkles className="w-3 h-3" />
            Class-A Office Standard
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-slate-900 leading-[1.05] max-w-4xl mx-auto"
          >
            Pass your next surprise client walkthrough. <span className="text-indigo-600">Every time.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Class-A Office Standard commercial cleaning for London businesses where appearance is part of revenue.
            Book your <strong>free 12-Point Office Cleanliness Audit</strong> — we walk the floor with you and quote on the spot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600"
          >
            <Trust icon={<Shield className="w-4 h-4 text-indigo-600" />} label="Insured & Bonded" />
            <Trust icon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />} label="Satisfaction guaranteed" />
            <Trust icon={<Building2 className="w-4 h-4 text-indigo-600" />} label="London commercial specialists" />
          </motion.div>
        </div>
      </section>

      {/* 3-tier menu */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-3">
              Three tiers. Built around your walkthrough.
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">
              Standard or Class-A — <span className="text-indigo-600">your call.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Free Audit (decoy) */}
            <div className="p-8 rounded-3xl border-2 border-slate-200 bg-slate-50 flex flex-col">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start here</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">Free 12-Point Audit</h3>
              <p className="text-4xl font-bold font-display text-slate-900 mb-1">$0</p>
              <p className="text-sm text-slate-500 mb-6">One-time walkthrough</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6 flex-grow">
                {AUDIT_INCLUDES.map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a href="#audit-form" className="block text-center px-5 py-3 rounded-xl bg-white border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-all">
                Book my free audit
              </a>
            </div>

            {/* Standard */}
            <div className="p-8 rounded-3xl border-2 border-slate-200 bg-white flex flex-col">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mid-tier</p>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">Standard</h3>
              <p className="text-4xl font-bold font-display text-slate-900 mb-1">$0.08-0.10<span className="text-base text-slate-500"> /sqft / visit</span></p>
              <p className="text-sm text-slate-500 mb-6">Monthly contract · 3x/wk avg</p>
              <ul className="space-y-2 text-sm text-slate-700 mb-6 flex-grow">
                {STANDARD_INCLUDES.map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a href="#audit-form" className="block text-center px-5 py-3 rounded-xl bg-white border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 transition-all">
                Get a Standard quote
              </a>
            </div>

            {/* Class-A Total Care */}
            <div className="p-8 rounded-3xl border-2 border-indigo-600 bg-slate-900 text-white flex flex-col relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="self-start mb-4 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                Most chosen
              </div>
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Premium</p>
              <h3 className="text-2xl font-bold font-display mb-2">Class-A Total Care</h3>
              <p className="text-4xl font-bold font-display mb-1">$0.12-0.15<span className="text-base text-indigo-200"> /sqft / visit</span></p>
              <p className="text-sm text-indigo-200 mb-6">Monthly contract · 5x/wk avg</p>
              <ul className="space-y-2 text-sm text-indigo-100 mb-6 flex-grow">
                {CLASS_A_INCLUDES.map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a href="#audit-form" className="block text-center px-5 py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all">
                Get a Class-A quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Form */}
      <section id="audit-form" className="py-16 bg-gradient-to-br from-indigo-50 via-white to-slate-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-3">
              Book your free 12-Point Audit
            </h2>
            <p className="text-slate-600">
              We walk your floor with you. You get a written quote within 24 hours. No contract required to book the audit.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-2 border-indigo-100 p-10 text-center shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900 mb-3">Audit request received.</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                A Trydentt team member will call within 24 hours to confirm the audit date.
                Nothing to pay, nothing to sign — we walk your floor and quote on the spot.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Business name *" value={form.businessName} onChange={v => setForm(f => ({ ...f, businessName: v }))} />
                <Field label="Your role" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} placeholder="Office mgr, owner, GM" />
                <Field label="Contact name *" value={form.contactName} onChange={v => setForm(f => ({ ...f, contactName: v }))} />
                <Field label="Phone *" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                <Field label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                <Field label="Approx. sqft" value={form.sqft} onChange={v => setForm(f => ({ ...f, sqft: v }))} placeholder="e.g. 3000" />
              </div>

              <Select label="Building type" value={form.buildingType} options={BUILDING_TYPES} onChange={v => setForm(f => ({ ...f, buildingType: v }))} />
              <Select label="Desired frequency" value={form.frequency} options={FREQUENCIES} onChange={v => setForm(f => ({ ...f, frequency: v }))} />
              <Select label="Current cleaning setup" value={form.currentCleaner} options={CURRENT_CLEANER} onChange={v => setForm(f => ({ ...f, currentCleaner: v }))} />

              <Field label="Preferred audit date" type="date" value={form.preferredAuditDate} onChange={v => setForm(f => ({ ...f, preferredAuditDate: v }))} />

              {submitError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all ${
                  submitting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <span>{submitting ? 'Submitting…' : 'Book my free 12-Point Audit'}</span>
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-xs text-slate-500 text-center">
                No payment. No contract. We walk your floor and quote within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            24-hour walkthrough re-clean guarantee.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Flag anything on your monthly walkthrough and we re-clean it within 24 hours — at no cost.
            That is the Trydentt Class-A Office Standard.
          </p>
        </div>
      </section>
    </>
  );
};

const Trust: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
    {icon}
    <span>{label}</span>
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  </div>
);

const Select: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const AUDIT_INCLUDES = [
  '12-Point Office Cleanliness scorecard',
  'Walk the floor with you in person',
  'Written quote within 24h',
  'No contract required to book',
  'Zero pressure — yours to use as a benchmark',
];

const STANDARD_INCLUDES = [
  'Routine office maintenance',
  'Restrooms, kitchen, break room',
  'High-touch surface disinfection',
  'Trash & recycling',
  'Vacuum & mop hard floors',
  'Insured and bonded',
];

const CLASS_A_INCLUDES = [
  'Everything in Standard',
  'Premium glass, conference, lobby treatment',
  'Branded uniformed team',
  'Detail-level dust & polish',
  'Surprise-walkthrough ready, every visit',
  '24h re-clean guarantee on flagged items',
];

export default Commercial;
