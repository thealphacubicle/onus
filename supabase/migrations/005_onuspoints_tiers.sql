-- OnusPoints: Update tiers table with OnusPoints reward_rate and reward_cap
-- reward_balance in commitments now stores points (100 pts = $1)

UPDATE public.tiers SET
  reward_rate = '0.5× OnusPoints',
  reward_cap = '350 pts ($3.50 value)',
  description = 'For building the habit. Low stakes to start — but the commitment is still real.'
WHERE id = 'starter';

UPDATE public.tiers SET
  reward_rate = '0.75× OnusPoints',
  reward_cap = '749 pts ($7.49 value)',
  description = 'For people ready to stop making excuses. Earn OnusPoints on every session you show up for.'
WHERE id = 'committed';

UPDATE public.tiers SET
  reward_rate = '1× OnusPoints',
  reward_cap = '1,799 pts ($17.99 value)',
  description = 'For when you''re done playing around. Earn OnusPoints at the highest standard rate.'
WHERE id = 'dedicated';

UPDATE public.tiers SET
  reward_rate = '2× OnusPoints',
  reward_cap = '1,798 pts ($17.98 value)',
  description = 'Earned after 180 days. $4.50/mo — the lowest you''ll ever pay, with the highest OnusPoints earn rate.'
WHERE id = 'onus_one';
