-- tiers: subscription pricing and display config (source of truth for tier data)
CREATE TABLE public.tiers (
  id TEXT PRIMARY KEY CHECK (id IN ('starter', 'committed', 'dedicated', 'onus_one')),
  name TEXT NOT NULL,
  price_monthly NUMERIC(10,2) NOT NULL,
  penalty_per_miss NUMERIC(10,2),
  first_month_free BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL,
  badge TEXT NOT NULL,
  badge_variant TEXT NOT NULL CHECK (badge_variant IN ('green', 'blue', 'amber', 'gold')),
  goal_range TEXT NOT NULL,
  grace_sessions TEXT NOT NULL,
  ai_coaching TEXT NOT NULL,
  reward_rate TEXT NOT NULL,
  reward_cap TEXT NOT NULL,
  weekly_check_in TEXT NOT NULL CHECK (weekly_check_in IN ('yes', 'no', 'n/a')),
  monthly_review BOOLEAN NOT NULL DEFAULT FALSE,
  onus_one_eligible TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_variant TEXT NOT NULL CHECK (cta_variant IN ('accent', 'outline')),
  selectable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tiers ENABLE ROW LEVEL SECURITY;

-- Tiers are read-only for all authenticated users; no write policy (admin would use service role)
CREATE POLICY "Anyone can read tiers" ON public.tiers
  FOR SELECT USING (true);

-- Seed tier data
INSERT INTO public.tiers (
  id, name, price_monthly, penalty_per_miss, first_month_free, description,
  badge, badge_variant, goal_range, grace_sessions, ai_coaching, reward_rate, reward_cap,
  weekly_check_in, monthly_review, onus_one_eligible, cta_text, cta_variant, selectable
) VALUES
  (
    'starter',
    'Starter',
    3.50,
    5,
    TRUE,
    'For building the habit. Low stakes to start — but the commitment is still real.',
    'First month free',
    'green',
    '1–2 sessions/week',
    '4/month',
    'Goal builder only',
    '0.5×',
    '$1.50',
    'no',
    FALSE,
    'Yes — after 180 days',
    'Try free',
    'accent',
    TRUE
  ),
  (
    'committed',
    'Committed',
    5.50,
    10,
    FALSE,
    'For people ready to stop making excuses. Earn 0.75× rewards on every session you show up for.',
    'Most popular',
    'blue',
    '3–4 sessions/week',
    '3/month',
    'Weekly check-in',
    '0.75×',
    '$3.00',
    'yes',
    FALSE,
    'Yes — after 180 days',
    'Get started',
    'accent',
    TRUE
  ),
  (
    'dedicated',
    'Dedicated',
    10.50,
    20,
    FALSE,
    'For when you''re done playing around. Earn 1× rewards — one dollar back for every dollar your subscription costs.',
    'Highest stakes',
    'amber',
    '5–7 sessions/week',
    '2/month',
    'Daily coaching + pushback',
    '1×',
    '$6.00',
    'n/a',
    TRUE,
    'Yes — after 180 days',
    'Get started',
    'accent',
    TRUE
  ),
  (
    'onus_one',
    'Onus One',
    4.50,
    NULL,
    FALSE,
    'Earned after 180 days. $4.50/mo — the lowest you''ll ever pay, with the highest reward rate.',
    'Earned, not bought',
    'gold',
    '—',
    '5/month',
    'Daily + insights',
    '2×',
    '$4.50',
    'yes',
    TRUE,
    'Invitation only — 180 days',
    'Available after 180 days',
    'outline',
    FALSE
  );
