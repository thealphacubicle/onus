-- OnusPoints: Convert existing reward_balance from dollars to points
-- 100 points = $1. Values < 500 are assumed to be legacy dollar amounts
-- (500 is the minimum redemption, so smaller values are likely dollars).

UPDATE public.commitments
SET reward_balance = ROUND(reward_balance * 100)
WHERE reward_balance > 0
  AND reward_balance < 500;
