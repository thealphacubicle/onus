-- Add OnusPoints columns to commitments
ALTER TABLE public.commitments
  ADD COLUMN IF NOT EXISTS onus_points INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onus_points_cap INTEGER NOT NULL DEFAULT 350,
  ADD COLUMN IF NOT EXISTS onus_points_lifetime INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_rate NUMERIC(4,2) NOT NULL DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS points_redeemed INTEGER NOT NULL DEFAULT 0;

-- Migrate reward_balance to onus_points (reward_balance stores points, 100 pts = $1)
UPDATE public.commitments
SET onus_points = COALESCE(ROUND(reward_balance)::INTEGER, 0)
WHERE onus_points = 0 AND reward_balance > 0;

-- Add points tracking to sessions
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS points_earned INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comeback_bonus BOOLEAN NOT NULL DEFAULT FALSE;

-- Add pool tracking to penalties
ALTER TABLE public.penalties
  ADD COLUMN IF NOT EXISTS points_to_pool INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_reflection TEXT;

-- Onus One qualification tracking
ALTER TABLE public.commitments
  ADD COLUMN IF NOT EXISTS consecutive_days_consistent INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onus_one_qualified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onus_one_qualified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS missed_goals_count INTEGER NOT NULL DEFAULT 0;

-- Allow onus_one tier in commitments
ALTER TABLE public.commitments DROP CONSTRAINT IF EXISTS commitments_tier_check;
ALTER TABLE public.commitments ADD CONSTRAINT commitments_tier_check
  CHECK (tier IN ('starter', 'committed', 'dedicated', 'onus_one'));

-- Points redemption log
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commitment_id UUID REFERENCES public.commitments(id) ON DELETE CASCADE,
  points_redeemed INTEGER NOT NULL,
  dollar_value NUMERIC(10,2) NOT NULL,
  partner TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','completed','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own redemptions"
  ON public.redemptions FOR ALL USING (auth.uid() = user_id);

-- Points expiry tracking
CREATE TABLE IF NOT EXISTS public.points_expiry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commitment_id UUID REFERENCES public.commitments(id),
  points_expired INTEGER NOT NULL,
  reason TEXT DEFAULT 'inactivity',
  expired_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.points_expiry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own expiry records"
  ON public.points_expiry FOR SELECT USING (auth.uid() = user_id);

-- Helper function: calculate points earned for a session
CREATE OR REPLACE FUNCTION calculate_session_points(
  tier_name TEXT,
  subscription_price NUMERIC,
  is_comeback_bonus BOOLEAN DEFAULT FALSE
) RETURNS INTEGER AS $$
DECLARE
  base_rate NUMERIC;
  monthly_cap INTEGER;
  daily_points INTEGER;
BEGIN
  CASE tier_name
    WHEN 'starter'   THEN base_rate := 0.5;  monthly_cap := 350;
    WHEN 'committed' THEN base_rate := 1.0;  monthly_cap := 999;
    WHEN 'dedicated' THEN base_rate := 1.25; monthly_cap := 2249;
    WHEN 'onus_one'  THEN base_rate := 2.0;  monthly_cap := 1798;
    ELSE base_rate := 0.5; monthly_cap := 350;
  END CASE;

  daily_points := FLOOR(monthly_cap / 30.0);

  IF is_comeback_bonus THEN
    daily_points := daily_points * 2;
  END IF;

  RETURN daily_points;
END;
$$ LANGUAGE plpgsql;

-- Helper function: calculate penalty pool contribution
CREATE OR REPLACE FUNCTION penalty_pool_contribution(
  penalty_amount NUMERIC
) RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(penalty_amount * 0.45 * 100);
END;
$$ LANGUAGE plpgsql;
