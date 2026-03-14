-- Update tiers table with new pricing (source of truth from mock-data.ts)

UPDATE public.tiers SET
  price_monthly = 6.99,
  penalty_per_miss = 7,
  first_month_free = TRUE,
  reward_rate = '0.5× OnusPoints',
  reward_cap = '350 pts ($3.50 value)',
  points_rate = 0.5,
  points_cap_per_month = 350,
  points_cap_dollar_value = 3.50,
  description = 'For building the habit. Low stakes to start — but the commitment is still real.'
WHERE id = 'starter';

UPDATE public.tiers SET
  price_monthly = 9.99,
  penalty_per_miss = 15,
  first_month_free = FALSE,
  reward_rate = '1× OnusPoints',
  reward_cap = '999 pts ($9.99 value)',
  points_rate = 1.0,
  points_cap_per_month = 999,
  points_cap_dollar_value = 9.99,
  description = 'For people ready to stop making excuses. Earn OnusPoints on every session you show up for.'
WHERE id = 'committed';

UPDATE public.tiers SET
  price_monthly = 17.99,
  penalty_per_miss = 30,
  first_month_free = FALSE,
  reward_rate = '1.25× OnusPoints',
  reward_cap = '2,249 pts ($22.49 value)',
  points_rate = 1.25,
  points_cap_per_month = 2249,
  points_cap_dollar_value = 22.49,
  description = 'For when you''re done playing around. Earn OnusPoints at the highest standard rate.'
WHERE id = 'dedicated';

UPDATE public.tiers SET
  price_monthly = 8.99,
  penalty_per_miss = NULL,
  first_month_free = FALSE,
  reward_rate = '2× OnusPoints',
  reward_cap = '1,798 pts ($17.98 value)',
  points_rate = 2.0,
  points_cap_per_month = 1798,
  points_cap_dollar_value = 17.98,
  description = 'Earned after 180 days. $8.99/mo — the lowest you''ll ever pay, with the highest OnusPoints earn rate.'
WHERE id = 'onus_one';
