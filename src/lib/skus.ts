// Single source of truth for SKU pricing, add-ons, and quote math.
// Locked 2026-05-10 — anchored to Bubble Cleaning London competitive data.
// See: /Documents/Premmisus/Clients/Trydentt/research/synthesis-trydentt-meta-relaunch-2026-05-10.md

export type SKUId = 'move-out' | 'bi-weekly' | 'friday-reset' | 'class-a-office';

export type Frequency = 'one-time' | 'weekly' | 'biweekly';

export interface SKUMeta {
  id: SKUId;
  productName: string;
  hook: string;
  guarantee: string;
  ctaLabel: string;
  category: 'residential' | 'commercial';
}

export const SKU_META: Record<SKUId, SKUMeta> = {
  'move-out': {
    id: 'move-out',
    productName: 'Move-Out Recovery System',
    hook: 'London tenants — leave a clean that passes inspection.',
    guarantee: '24h guarantee — if your landlord points out anything, we are back to fix it free.',
    ctaLabel: 'Reserve my move-out clean',
    category: 'residential',
  },
  'bi-weekly': {
    id: 'bi-weekly',
    productName: 'Bi-Weekly Reset Program',
    hook: 'London parents — reclaim 6 Saturdays a year with the Trydentt Bi-Weekly Reset.',
    guarantee: '48h guarantee — anything we missed, re-cleaned free within 48 hours.',
    ctaLabel: 'Lock my London rate',
    category: 'residential',
  },
  'friday-reset': {
    id: 'friday-reset',
    productName: 'Friday Reset',
    hook: 'Walk into a showroom-clean house this Friday — the Trydentt Friday Reset.',
    guarantee: '24h guarantee — anything not showroom-clean, we are back Saturday morning.',
    ctaLabel: 'Book my Friday Reset',
    category: 'residential',
  },
  'class-a-office': {
    id: 'class-a-office',
    productName: 'Class-A Office Standard',
    hook: 'Class-A Office Standard — for London businesses where appearance is part of revenue.',
    guarantee: '24h guarantee — anything you flag on your monthly walkthrough, re-cleaned within 24h.',
    ctaLabel: 'Book my free 12-Point Audit',
    category: 'commercial',
  },
};

// Base prices by bedroom tier — Bubble-anchored, undercut on entry tier.
// Tier index = bedrooms (0 = studio/1BR, 1 = 2BR, 2 = 3BR, 3 = 4BR+).
export const SKU_BASE_PRICING: Record<Exclude<SKUId, 'class-a-office'>, number[]> = {
  'move-out':     [329, 379, 419, 489],
  'bi-weekly':    [179, 179, 219, 259], // 1-2BR same tier
  'friday-reset': [229, 229, 289, 359], // 1-2BR same tier
};

// Maps a bedroom count to the tier index used above.
export function bedroomsToTier(bedrooms: number): number {
  if (bedrooms <= 1) return 0;
  if (bedrooms === 2) return 1;
  if (bedrooms === 3) return 2;
  return 3; // 4+
}

// Bathroom surcharge per extra bathroom above 1.
export const BATHROOM_SURCHARGE = 25;

// Frequency multiplier for the Bi-Weekly Reset SKU.
// Hormozi-hybrid: NO discount erosion. Weekly is a +20% upgrade; biweekly is flat.
export const FREQUENCY_MULT: Record<Frequency, number> = {
  'one-time': 1.0,
  biweekly: 1.0,
  weekly: 1.2,
};

export interface Addon {
  id: string;
  label: string;
  price: number;
  description?: string;
  // Add-ons may be INCLUDED in certain SKU bonus stacks. Pricing logic respects this.
  includedIn?: SKUId[];
}

// Residential add-on menu. See synthesis doc § 8 for the locked menu.
export const ADDONS: Addon[] = [
  { id: 'inside-fridge',    label: 'Inside Fridge',          price: 45, includedIn: ['move-out'] },
  { id: 'inside-oven',      label: 'Inside Oven',            price: 35, includedIn: ['move-out', 'friday-reset'] },
  { id: 'inside-cabinets',  label: 'Inside Cabinets',        price: 8,  description: 'per cabinet', includedIn: ['move-out'] },
  { id: 'inside-dishwasher', label: 'Inside Dishwasher',     price: 20 },
  { id: 'interior-windows', label: 'Interior Windows',       price: 5,  description: 'per window, capped at $80' },
  { id: 'wet-wipe-blinds',  label: 'Wet Wipe Blinds',        price: 6,  description: 'per window' },
  { id: 'walls-spot-wipe',  label: 'Walls Spot Wipe',        price: 30, includedIn: ['move-out'] },
  { id: 'carpet-shampoo',   label: 'Full Carpet Shampoo',    price: 120, description: 'first room + $60 each additional' },
  { id: 'rug-shampoo',      label: 'Rug Shampoo',            price: 45, description: 'per rug' },
  { id: 'basement',         label: 'Basement',               price: 60 },
  { id: 'dishes',           label: 'Dishes (full sink)',     price: 20 },
  { id: 'laundry-fold',     label: 'Laundry & Fold',         price: 30, description: 'per load' },
  { id: 'pets',             label: 'I Have Pets',            price: 25, description: 'extra dander/hair time' },
  { id: 'green-cleaning',   label: 'Green Cleaning',         price: 0,  description: 'FREE — eco-friendly products' },
];

export const ADDON_BY_ID: Record<string, Addon> = Object.fromEntries(ADDONS.map(a => [a.id, a]));

export interface QuoteState {
  sku: SKUId;
  bedrooms: number;
  bathrooms: number; // supports 0.5 increments
  addons: string[];  // addon ids
  frequency: Frequency;
  annualLockIn?: boolean;
}

export interface QuoteResult {
  subtotal: number;       // before taxes
  basePrice: number;
  bathroomSurcharge: number;
  addonTotal: number;
  annualBonusNote?: string;
}

/**
 * Pure pricing function. Same input always returns same output.
 * Used by SKUCalculator UI and by api/lead.ts for server-side validation.
 */
export function calculateQuote(state: QuoteState): QuoteResult {
  if (state.sku === 'class-a-office') {
    // Commercial uses a free Audit flow, not flat residential math.
    return { subtotal: 0, basePrice: 0, bathroomSurcharge: 0, addonTotal: 0 };
  }

  const tier = bedroomsToTier(state.bedrooms);
  const basePrice = SKU_BASE_PRICING[state.sku][tier];

  const extraBathrooms = Math.max(0, state.bathrooms - 1);
  const bathroomSurcharge = extraBathrooms * BATHROOM_SURCHARGE;

  const addonTotal = state.addons.reduce((sum, addonId) => {
    const addon = ADDON_BY_ID[addonId];
    if (!addon) return sum;
    // If add-on is INCLUDED in this SKU's bonus stack, no extra charge.
    if (addon.includedIn?.includes(state.sku)) return sum;
    return sum + addon.price;
  }, 0);

  const mult = state.sku === 'bi-weekly' ? FREQUENCY_MULT[state.frequency] : 1.0;
  const subtotal = Math.round((basePrice + bathroomSurcharge + addonTotal) * mult);

  const result: QuoteResult = {
    subtotal,
    basePrice,
    bathroomSurcharge,
    addonTotal,
  };

  if (state.sku === 'bi-weekly' && state.annualLockIn) {
    result.annualBonusNote = 'Annual lock-in = first deep clean FREE ($299 value) + 12-month locked rate.';
  }

  return result;
}

// Default state by SKU — used to initialise SKUCalculator.
export function defaultStateFor(sku: SKUId): QuoteState {
  return {
    sku,
    bedrooms: 2,
    bathrooms: 1,
    addons: [],
    frequency: sku === 'bi-weekly' ? 'biweekly' : 'one-time',
    annualLockIn: false,
  };
}
