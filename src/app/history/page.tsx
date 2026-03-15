import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HistoryTableClient } from "@/components/history/HistoryTableClient";
import type { WeekSummary } from "@/lib/types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

async function getHistoryData(
  userId: string
): Promise<{
  history: WeekSummary[];
  userName: string;
  streak: number;
  goalFrequency: number;
  missesThisMonth: number;
}> {
  const supabase = await createClient();

  try {
    const [
      sessionsRes,
      penaltiesRes,
      profileRes,
      commitRes,
      monthPenaltiesRes,
    ] = await Promise.all([
        supabase
          .from("sessions")
          .select("id, scheduled_date, checked_in, missed")
          .eq("user_id", userId)
          .order("scheduled_date", { ascending: false })
          .limit(500),
        supabase
          .from("penalties")
          .select("session_id, amount")
          .eq("user_id", userId),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("commitments")
          .select("goal_frequency")
          .eq("user_id", userId)
          .eq("active", true)
          .limit(1)
          .maybeSingle(),
        (() => {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return supabase
            .from("penalties")
            .select("id")
            .eq("user_id", userId)
            .gte("charged_at", start.toISOString())
            .lte("charged_at", end.toISOString());
        })(),
      ]);

    const sessions = sessionsRes.data ?? [];
    const penalties = penaltiesRes.data ?? [];
    const penaltyBySession = new Map(
      penalties.map((p) => [p.session_id, Number(p.amount)])
    );

    const byWeek = new Map<
      string,
      {
        startDate: string;
        endDate: string;
        dateRange: string;
        completed: number;
        missed: number;
        penaltyTotal: number;
        missedDays: string[];
      }
    >();

    for (const s of sessions) {
      const monday = getMonday(new Date(s.scheduled_date));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const key = monday.toISOString().split("T")[0];

      if (!byWeek.has(key)) {
        byWeek.set(key, {
          startDate: key,
          endDate: sunday.toISOString().split("T")[0],
          dateRange: formatDateRange(monday, sunday),
          completed: 0,
          missed: 0,
          penaltyTotal: 0,
          missedDays: [],
        });
      }

      const week = byWeek.get(key)!;
      if (s.checked_in) week.completed++;
      else if (s.missed) {
        week.missed++;
        week.penaltyTotal += penaltyBySession.get(s.id) ?? 0;
        const dayName = DAY_NAMES[new Date(s.scheduled_date).getDay()];
        if (!week.missedDays.includes(dayName)) {
          week.missedDays.push(dayName);
        }
      }
    }

    const history: WeekSummary[] = Array.from(byWeek.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, w]) => ({
        id: key,
        dateRange: w.dateRange,
        startDate: w.startDate,
        endDate: w.endDate,
        sessionsCompleted: w.completed,
        sessionsMissed: w.missed,
        penaltiesCharged: w.penaltyTotal,
        missedDays: w.missedDays,
      }));

    const goalFrequency = commitRes.data?.goal_frequency ?? 3;
    const missesThisMonth = monthPenaltiesRes.data?.length ?? 0;

    let userName = "there";
    if (profileRes.data?.full_name) {
      userName = profileRes.data.full_name.split(" ")[0];
    }

    let streak = 0;
    const sortedWeeks = Array.from(byWeek.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [, w] of sortedWeeks) {
      const weekSessions = sessions.filter((s) => {
        const m = getMonday(new Date(s.scheduled_date));
        return m.toISOString().split("T")[0] === w.startDate;
      });
      const allDone = weekSessions.every((s) => s.checked_in);
      const anyMissed = weekSessions.some((s) => s.missed);
      if (allDone && !anyMissed) streak++;
      else break;
    }

    return { history, userName, streak, goalFrequency, missesThisMonth };
  } catch {
    return {
      history: [],
      userName: "there",
      streak: 0,
      goalFrequency: 3,
      missesThisMonth: 0,
    };
  }
}

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    history,
    userName,
    streak,
    goalFrequency,
    missesThisMonth,
  } = await getHistoryData(user.id);

  return (
    <DashboardLayout userName={userName} streak={streak}>
      <h1 className="text-2xl font-semibold text-[#f0efe8]">History</h1>
      <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
        Your past weeks and penalties
      </p>
      <div className="mt-6 min-w-0 overflow-x-auto">
        <HistoryTableClient
          history={history}
          userName={userName}
          goalFrequency={goalFrequency}
          missesThisMonth={missesThisMonth}
        />
      </div>
    </DashboardLayout>
  );
}
