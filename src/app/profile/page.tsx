import { createClient } from "@/lib/supabase/server";
import { ProfileContent } from "@/components/profile/ProfileContent";
import type { Commitment } from "@/lib/types";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function toUiCommitment(
  c: {
    tier: string;
    goal_description: string | null;
    goal_frequency: number;
    penalty_amount: number;
    grace_sessions_remaining: number;
    grace_sessions_total: number;
  } | null
): Commitment {
  if (!c) {
    return {
      tierId: "committed",
      goal: "No active commitment",
      sessionsPerWeek: 3,
      penaltyPerMiss: 10,
      graceSessionsRemaining: 0,
      graceSessionsTotal: 0,
    };
  }
  return {
    tierId: c.tier as Commitment["tierId"],
    goal: c.goal_description ?? "No goal set",
    sessionsPerWeek: c.goal_frequency,
    penaltyPerMiss: c.penalty_amount,
    graceSessionsRemaining: c.grace_sessions_remaining,
    graceSessionsTotal: c.grace_sessions_total,
  };
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let fullName = user.user_metadata?.full_name ?? "";
  let email = user.email ?? "";
  let commitment: Commitment = toUiCommitment(null);
  let streak = 0;
  let paymentMethods: { id: string; last4: string; brand: string; exp_month: number; exp_year: number }[] = [];

  try {
    const [profileRes, commitRes, sessionsRes, paymentMethodsRes] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("commitments")
          .select("*")
          .eq("user_id", user.id)
          .eq("active", true)
          .limit(1)
          .maybeSingle(),
        supabase
          .from("sessions")
          .select("scheduled_date, checked_in, missed")
          .eq("user_id", user.id)
          .order("scheduled_date", { ascending: false })
          .limit(200),
        supabase
          .from("payment_methods")
          .select("id, last4, brand, exp_month, exp_year")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

    if (profileRes.data) {
      fullName = profileRes.data.full_name ?? fullName;
      email = profileRes.data.email ?? email;
    }

    if (commitRes.data) {
      commitment = toUiCommitment(commitRes.data);
    }

    paymentMethods = paymentMethodsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];
    const byWeek = new Map<string, typeof sessions>();
    for (const s of sessions) {
      const monday = getMonday(new Date(s.scheduled_date));
      const key = monday.toISOString().split("T")[0];
      if (!byWeek.has(key)) byWeek.set(key, []);
      byWeek.get(key)!.push(s);
    }
    const sortedWeeks = Array.from(byWeek.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [, weekSessions] of sortedWeeks) {
      const allDone = weekSessions.every((s) => s.checked_in);
      const anyMissed = weekSessions.some((s) => s.missed);
      if (allDone && !anyMissed) streak++;
      else break;
    }
  } catch {
    // Fallback to auth user data
    if (!fullName && user.email) {
      fullName = user.email.split("@")[0] ?? "";
    }
  }

  return (
    <ProfileContent
      fullName={fullName}
      email={email}
      commitment={commitment}
      streak={streak}
      paymentMethods={paymentMethods}
    />
  );
}
