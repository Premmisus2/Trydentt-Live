-- Trydentt Ads Schema
-- Run inside the command-center Supabase instance (yxtpqjmvixwxjnmhowvk)
-- Creates 6 tables under the public schema with `ads_` prefix for now.
-- When multi-tenant comes online, move into a `trydentt_ads` schema.

-- Campaigns across Meta + Google
create table if not exists ads_campaigns (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('meta','google')),
  external_id text not null,
  name text not null,
  objective text,
  budget_daily_cents integer,
  currency text default 'CAD',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (platform, external_id)
);

-- Ad sets (Meta) / Ad groups (Google)
create table if not exists ads_adsets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references ads_campaigns(id) on delete cascade,
  external_id text not null,
  name text not null,
  targeting jsonb,
  status text not null default 'active',
  created_at timestamptz default now(),
  unique (campaign_id, external_id)
);

-- Individual creatives (one row per ad variation)
create table if not exists ads_creatives (
  id uuid primary key default gen_random_uuid(),
  adset_id uuid references ads_adsets(id) on delete cascade,
  platform text not null check (platform in ('meta','google')),
  external_id text not null,
  concept_code text, -- e.g. 'meta_A_friday_night'
  image_url text,
  copy_json jsonb, -- { headline, primary_text, description, cta }
  utm_content text,
  hypothesis text, -- why we think this will win
  parent_id uuid references ads_creatives(id), -- lineage for winner-derived variants
  status text not null default 'active',
  created_at timestamptz default now(),
  unique (platform, external_id)
);

-- Daily performance rollup (one row per creative per day)
create table if not exists ads_performance (
  id uuid primary key default gen_random_uuid(),
  creative_id uuid not null references ads_creatives(id) on delete cascade,
  date date not null,
  impressions integer default 0,
  clicks integer default 0,
  spend_cents integer default 0,
  leads integer default 0,
  conversions integer default 0,
  cpc_cents integer,
  cpl_cents integer,
  ctr numeric,
  created_at timestamptz default now(),
  unique (creative_id, date)
);

-- Research briefs from Perplexity / Gemini deep research
create table if not exists ads_research_briefs (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  source text not null, -- 'perplexity' | 'gemini_deep_research' | 'weekly_audit'
  query text not null,
  findings_json jsonb,
  created_at timestamptz default now()
);

-- Leads flowing through /api/lead
create table if not exists ads_leads (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz default now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  name text,
  email text,
  phone text,
  postal text,
  city text,
  ghl_contact_id text,
  meta_event_id text,
  page_path text,
  fbp text,
  fbc text,
  raw jsonb
);

-- Useful indexes
create index if not exists idx_ads_performance_creative_date on ads_performance (creative_id, date desc);
create index if not exists idx_ads_leads_submitted_at on ads_leads (submitted_at desc);
create index if not exists idx_ads_leads_utm_content on ads_leads (utm_content);
create index if not exists idx_ads_creatives_concept on ads_creatives (concept_code);
