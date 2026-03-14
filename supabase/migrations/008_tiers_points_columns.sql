-- Add OnusPoints numeric columns to tiers for programmatic use
-- (reward_rate and reward_cap remain as display text)

ALTER TABLE public.tiers
  ADD COLUMN IF NOT EXISTS points_rate NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS points_cap_per_month INTEGER,
  ADD COLUMN IF NOT EXISTS points_cap_dollar_value NUMERIC(5,2);

UPDATE public.tiers SET
  points_rate = 0.5,
  points_cap_per_month = 350,
  points_cap_dollar_value = 3.50
WHERE id = 'starter';

UPDATE public.tiers SET
  points_rate = 0.75,
  points_cap_per_month = 749,
  points_cap_dollar_value = 7.49
WHERE id = 'committed';

UPDATE public.tiers SET
  points_rate = 1.0,
  points_cap_per_month = 1799,
  points_cap_dollar_value = 17.99
WHERE id = 'dedicated';

UPDATE public.tiers SET
  points_rate = 2.0,
  points_cap_per_month = 1798,
  points_cap_dollar_value = 17.98
WHERE id = 'onus_one';
