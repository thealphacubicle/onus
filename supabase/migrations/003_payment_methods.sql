-- payment_methods: stores card metadata for display (last4, brand, expiry)
-- Actual payment processing would use Stripe; this table holds references/metadata
CREATE TABLE public.payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  last4 TEXT NOT NULL CHECK (char_length(last4) = 4),
  brand TEXT NOT NULL CHECK (brand IN ('visa', 'mastercard', 'amex', 'discover')),
  exp_month INTEGER NOT NULL CHECK (exp_month >= 1 AND exp_month <= 12),
  exp_year INTEGER NOT NULL CHECK (exp_year >= 2020 AND exp_year <= 2100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);
