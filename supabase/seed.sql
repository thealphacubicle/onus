-- Demo seed data for hackathon
-- Seeds the first auth user with a Committed-tier commitment matching MOCK_USER/MOCK_HISTORY.
-- Run: supabase db seed (after migrations and with at least one user in auth.users)

DO $$
DECLARE
  demo_user_id UUID;
  c_id UUID;
  s_id UUID;
  w1 DATE; w2 DATE; w3 DATE; w4 DATE; w5 DATE; w6 DATE;
BEGIN
  SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
  IF demo_user_id IS NULL THEN
    RAISE NOTICE 'No users in auth.users. Sign up first, then run seed again.';
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM public.commitments WHERE user_id = demo_user_id AND active = true) THEN
    RAISE NOTICE 'User already has an active commitment. Skipping seed.';
    RETURN;
  END IF;

  -- Insert commitment (Committed tier)
  INSERT INTO public.commitments (
    user_id, tier, goal_frequency, goal_description, penalty_amount,
    grace_sessions_remaining, grace_sessions_total, onus_points, onus_points_cap,
    points_rate, active, why, consecutive_days_consistent, reward_balance
  ) VALUES (
    demo_user_id, 'committed', 3,
    'Attend the gym 3 times per week — Mon, Wed, Fri',
    15.00, 2, 3, 1240, 999, 1.0, true,
    'I want to get my energy back after months of sitting at a desk',
    14, 1240
  )
  RETURNING id INTO c_id;

  -- Week starts (Mondays)
  w1 := '2025-03-03'; w2 := '2025-02-24'; w3 := '2025-02-17';
  w4 := '2025-02-10'; w5 := '2025-02-03'; w6 := '2025-01-27';

  -- Week 1 (Mar 3-9): 3 done, 0 missed
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w1, true, w1 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w1 + 2, true, w1 + 2 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w1 + 4, true, w1 + 4 + interval '10 hours', false, 0, false, 33);

  -- Week 2 (Feb 24-Mar 2): 2 done, 1 missed, penalty $15
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w2, true, w2 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w2 + 2, true, w2 + 2 + interval '10 hours', false, 0, false, 33);
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w2 + 4, false, NULL, true, 15, false, 0)
  RETURNING id INTO s_id;
  INSERT INTO public.penalties (user_id, session_id, amount, points_to_pool) VALUES (demo_user_id, s_id, 15, 675);

  -- Week 3 (Feb 17-23): 3 done
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w3, true, w3 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w3 + 2, true, w3 + 2 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w3 + 4, true, w3 + 4 + interval '10 hours', false, 0, false, 33);

  -- Week 4 (Feb 10-16): 1 done, 2 missed, penalty $30
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w4, true, w4 + interval '10 hours', false, 0, false, 33);
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w4 + 2, false, NULL, true, 15, false, 0)
  RETURNING id INTO s_id;
  INSERT INTO public.penalties (user_id, session_id, amount, points_to_pool) VALUES (demo_user_id, s_id, 15, 675);
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w4 + 4, false, NULL, true, 15, false, 0)
  RETURNING id INTO s_id;
  INSERT INTO public.penalties (user_id, session_id, amount, points_to_pool) VALUES (demo_user_id, s_id, 15, 675);

  -- Week 5 (Feb 3-9): 3 done
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w5, true, w5 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w5 + 2, true, w5 + 2 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w5 + 4, true, w5 + 4 + interval '10 hours', false, 0, false, 33);

  -- Week 6 (Jan 27-Feb 2): 3 done
  INSERT INTO public.sessions (user_id, commitment_id, scheduled_date, checked_in, checked_in_at, missed, penalty_charged, grace_used, points_earned)
  VALUES (demo_user_id, c_id, w6, true, w6 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w6 + 2, true, w6 + 2 + interval '10 hours', false, 0, false, 33),
         (demo_user_id, c_id, w6 + 4, true, w6 + 4 + interval '10 hours', false, 0, false, 33);

  RAISE NOTICE 'Seeded demo data for user %', demo_user_id;
END $$;
