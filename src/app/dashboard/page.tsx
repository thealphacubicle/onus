import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { getSelectableTiers, getTierPointsConfig } from "@/lib/tiers";
import { MOCK_DASHBOARD_STATS, TIERS } from "@/lib/mock-data";
import type { Commitment } from "@/lib/types";
import type { DayStatus } from "@/components/dashboard/WeekView";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekDates(monday: Date): { date: string; dayName: string }[] {
  const days: { date: string; dayName: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dayName: DAY_NAMES[d.getDay()],
    });
  }
  return days;
}

function computeStreak(sessions: { scheduled_date: string; checked_in: boolean; missed: boolean }[]): number {
  if (!sessions.length) return 0;

  const byWeek = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const monday = getMonday(new Date(s.scheduled_date));
    const key = monday.toISOString().split("T")[0];
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(s);
  }

  const sortedWeeks = Array.from(byWeek.entries()).sort(
    (a, b) => b[0].localeCompare(a[0])
  );

  let streak = 0;
  for (const [, weekSessions] of sortedWeeks) {
    const allDone = weekSessions.every((s) => s.checked_in);
    const anyMissed = weekSessions.some((s) => s.missed);
    if (allDone && !anyMissed) streak++;
    else break;
  }
  return streak;
}

function toUiCommitment(
  c: {
    tier: string;
    goal_description: string | null;
    goal_frequency: number;
    penalty_amount: number;
    grace_sessions_remaining: number;
    grace_sessions_total: number;
    onus_points?: number;
    reward_balance?: number;
  } | null
): Commitment {
  if (!c) {
    return {
      tierId: "committed",
      goal: "No active commitment",
      sessionsPerWeek: 3,
      penaltyPerMiss: TIERS.committed.penalty,
      graceSessionsRemaining: 0,
      graceSessionsTotal: TIERS.committed.graceSessions,
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const [tiers, tierPointsConfig] = await Promise.all([
    getSelectableTiers(),
    getTierPointsConfig(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let commitment: Commitment | null = null;
  let sessionsThisWeek = 0;
  let sessionsGoal = 3;
  let penaltiesCharged = 0;
  let onusPoints: number = MOCK_DASHBOARD_STATS.onusPoints;
  let pointsEarnedThisMonth = MOCK_DASHBOARD_STATS.onusPointsEarnedThisMonth;
  let pointsCap: number = MOCK_DASHBOARD_STATS.onusPointsCap;
  let streak = 0;
  let weekDays: { date: string; dayName: string; status: DayStatus }[] = [];
  let userName = user.email?.split("@")[0] ?? "there";

  try {
    const [
      commitRes,
      profileRes,
      sessionsRes,
      penaltiesRes,
      allSessionsRes,
    ] = await Promise.all([
        supabase
          .from("commitments")
          .select("*")
          .eq("user_id", user.id)
          .eq("active", true)
          .limit(1)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle(),
        (() => {
          const today = new Date();
          const monday = getMonday(today);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          return supabase
            .from("sessions")
            .select("scheduled_date, checked_in, missed")
            .eq("user_id", user.id)
            .gte("scheduled_date", monday.toISOString().split("T")[0])
            .lte("scheduled_date", sunday.toISOString().split("T")[0]);
        })(),
        (() => {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return supabase
            .from("penalties")
            .select("amount")
            .eq("user_id", user.id)
            .gte("charged_at", start.toISOString())
            .lte("charged_at", end.toISOString());
        })(),
        supabase
          .from("sessions")
          .select("scheduled_date, checked_in, missed")
          .eq("user_id", user.id)
          .order("scheduled_date", { ascending: false })
          .limit(200),
      ]);

    const c = commitRes.data;
    commitment = toUiCommitment(c);
    if (c) {
      sessionsGoal = c.goal_frequency;
      onusPoints =
        Math.round(Number((c as { onus_points?: number }).onus_points ?? c.reward_balance ?? 0)) ||
        MOCK_DASHBOARD_STATS.onusPoints;
      pointsCap =
        tierPointsConfig[c.tier]?.pointsCapPerMonth ?? MOCK_DASHBOARD_STATS.onusPointsCap;
      pointsEarnedThisMonth = 0;
    }

    if (profileRes.data?.full_name) {
      userName = profileRes.data.full_name.split(" ")[0];
    }

    const thisWeekSessions = sessionsRes.data ?? [];
    sessionsThisWeek = thisWeekSessions.filter((s) => s.checked_in).length;

    const monthPenalties = penaltiesRes.data ?? [];
    penaltiesCharged = monthPenalties.reduce((sum, p) => sum + Number(p.amount), 0);

    streak = computeStreak(allSessionsRes.data ?? []);

    const todayStr = new Date().toISOString().split("T")[0];
    const sessionByDate = new Map(
      thisWeekSessions.map((s) => [s.scheduled_date, s])
    );

    const monday = getMonday(new Date());
    const baseDays = getWeekDates(monday);

    weekDays = baseDays.map(({ date, dayName }) => {
      const session = sessionByDate.get(date);
      const isToday = date === todayStr;
      let status: DayStatus = "rest";
      if (session) {
        if (session.checked_in) status = "done";
        else if (session.missed) status = "missed";
        else if (isToday) status = "today";
      } else if (isToday) {
        status = "today";
      }
      return { date, dayName, status };
    });
  } catch {
    weekDays = getWeekDates(getMonday(new Date())).map(({ date, dayName }) => ({
      date,
      dayName,
      status: "rest" as DayStatus,
    }));
  }

  return (
    <DashboardContent
      userName={userName}
      streak={streak}
      sessionsThisWeek={sessionsThisWeek}
      sessionsGoal={sessionsGoal}
      penaltiesCharged={penaltiesCharged}
      onusPoints={onusPoints}
      pointsEarnedThisMonth={pointsEarnedThisMonth}
      pointsCap={pointsCap}
      weekDays={weekDays}
      commitment={commitment ?? toUiCommitment(null)}
      tiers={tiers}
      tierPointsConfig={tierPointsConfig}
    />
  );
}
