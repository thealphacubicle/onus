-- OnusPoints: Update seed to use points instead of dollars
-- reward_balance now stores OnusPoints (1240 pts = $12.40 redemption value)

CREATE OR REPLACE FUNCTION public.seed_new_user_data()
RETURNS TRIGGER AS $$
DECLARE
  c_id UUID;
  w_start DATE;
  d DATE;
  i INT;
  j INT;
  days_of_week INT[] := ARRAY[1, 3, 5]; -- Mon, Wed, Fri (ISO: 1=Mon, 3=Wed, 5=Fri)
  s_id UUID;
  is_past BOOLEAN;
  is_done BOOLEAN;
  is_missed BOOLEAN;
BEGIN
  -- Insert commitment (committed tier, 3x/week)
  -- reward_balance: 1240 OnusPoints = $12.40 redemption value
  INSERT INTO public.commitments (
    user_id, tier, goal_frequency, goal_description, penalty_amount,
    grace_sessions_total, grace_sessions_remaining, reward_balance
  ) VALUES (
    NEW.id,
    'committed',
    3,
    'Hit the gym 3 times per week — Mon, Wed, Fri mornings before work',
    10,
    4,
    1,
    1240
  )
  RETURNING id INTO c_id;

  -- Monday of current week (ISO week starts Monday)
  w_start := date_trunc('week', current_date)::date;

  -- Generate sessions for past 2 weeks + current week + next week (4 weeks total)
  -- Past: 2 done + 1 missed per week (for realistic stats)
  FOR i IN -2..1 LOOP
    FOR j IN 1..3 LOOP
      d := w_start + (i * 7) + (days_of_week[j] - 1);
      is_past := d < current_date;
      -- j=1 Mon: done, j=2 Wed: done, j=3 Fri: missed (for past weeks)
      is_done := is_past AND j IN (1, 2);
      is_missed := is_past AND j = 3;

      INSERT INTO public.sessions (
        user_id, commitment_id, scheduled_date,
        checked_in, checked_in_at, missed, penalty_charged, grace_used
      ) VALUES (
        NEW.id,
        c_id,
        d,
        is_done,
        CASE WHEN is_done THEN d + interval '10 hours' ELSE NULL END,
        is_missed,
        CASE WHEN is_missed THEN 10 ELSE 0 END,
        false
      )
      RETURNING id INTO s_id;

      IF is_missed THEN
        INSERT INTO public.penalties (user_id, session_id, amount)
        VALUES (NEW.id, s_id, 10);
      END IF;
    END LOOP;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
