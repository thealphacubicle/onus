import { createClient } from "@/lib/supabase/server";
import { MOCK_COACHING_MESSAGE } from "@/lib/mock-data";
import { formatAiMessage } from "@/lib/utils";
import { getSelectableTiers } from "@/lib/tiers";
import type { TierId } from "@/lib/types";

const TIER_ORDER: TierId[] = ["starter", "committed", "dedicated"];
const VALID_TIER_IDS: TierId[] = ["starter", "committed", "dedicated"];

function normalizeTierId(raw: string | null | undefined): TierId {
  const lower = (raw ?? "committed").toString().toLowerCase();
  return VALID_TIER_IDS.includes(lower as TierId) ? (lower as TierId) : "committed";
}

function getNextTier(current: TierId): TierId | null {
  const idx = TIER_ORDER.indexOf(current);
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

const SEEDED_COACHING_CONTEXT = {
  userName: "Alex",
  tier: "committed",
  goalFrequency: 3,
  currentStreak: 14,
  sessionsThisWeek: 2,
  sessionsGoal: 3,
  missesThisMonth: 1,
  why: "I want to get my energy back after months of sitting at a desk",
  recentPattern: "tends to miss Thursday sessions",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

const DAY_NAMES_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

function computeRecentPattern(
  sessions: { scheduled_date: string; missed: boolean }[]
): string {
  const missedByDay = new Map<number, number>();
  for (const s of sessions) {
    if (s.missed) {
      const d = new Date(s.scheduled_date);
      missedByDay.set(d.getDay(), (missedByDay.get(d.getDay()) ?? 0) + 1);
    }
  }
  if (missedByDay.size === 0) return "no recent misses";
  const sorted = [...missedByDay.entries()].sort((a, b) => b[1] - a[1]);
  const dayName = DAY_NAMES_FULL[sorted[0][0]];
  return sorted[0][1] >= 2
    ? `tends to miss ${dayName} sessions`
    : `missed ${dayName} recently`;
}

function computeStreak(
  sessions: { scheduled_date: string; checked_in: boolean; missed: boolean }[]
): number {
  if (!sessions.length) return 0;
  const byWeek = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const key = getMonday(new Date(s.scheduled_date)).toISOString().split("T")[0];
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(s);
  }
  const sorted = Array.from(byWeek.entries()).sort((a, b) =>
    b[0].localeCompare(a[0])
  );
  let streak = 0;
  for (const [, weekSessions] of sorted) {
    const allDone = weekSessions.every((s) => s.checked_in);
    const anyMissed = weekSessions.some((s) => s.missed);
    if (allDone && !anyMissed) streak++;
    else break;
  }
  return streak;
}

function computeWeeksConsistent(
  sessions: { scheduled_date: string; checked_in: boolean; missed: boolean }[],
  goalPerWeek: number
): number {
  if (!sessions.length || goalPerWeek <= 0) return 0;
  const byWeek = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const key = getMonday(new Date(s.scheduled_date)).toISOString().split("T")[0];
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(s);
  }
  const sorted = Array.from(byWeek.entries()).sort((a, b) =>
    b[0].localeCompare(a[0])
  );
  let count = 0;
  for (const [, weekSessions] of sorted) {
    const completed = weekSessions.filter((s) => s.checked_in).length;
    const anyMissed = weekSessions.some((s) => s.missed);
    if (completed >= goalPerWeek && !anyMissed) count++;
    else break;
  }
  return count;
}

async function fetchCoachingMessage(context: {
  userName: string;
  tier: string;
  goalFrequency: number;
  currentStreak: number;
  sessionsThisWeek: number;
  sessionsGoal: number;
  missesThisMonth: number;
  why: string;
  recentPattern: string;
}): Promise<string> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  try {
    const res = await fetch(`${base}/api/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "coaching", context }),
    });
    if (!res.ok) return MOCK_COACHING_MESSAGE;
    const reader = res.body?.getReader();
    if (!reader) return MOCK_COACHING_MESSAGE;
    const decoder = new TextDecoder();
    let text = "";
    const buffer: string[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer.push(decoder.decode(value, { stream: true }));
      const chunk = buffer.join("");
      const lines = chunk.split("\n");
      buffer.length = 0;
      buffer.push(lines.pop() ?? "");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line) as { text?: string };
          if (parsed.text) text += parsed.text;
        } catch {
          /* skip */
        }
      }
    }
    if (buffer[0]) {
      try {
        const parsed = JSON.parse(buffer[0]) as { text?: string };
        if (parsed.text) text += parsed.text;
      } catch {
        /* ignore */
      }
    }
    return formatAiMessage(text.trim() || MOCK_COACHING_MESSAGE);
  } catch {
    return MOCK_COACHING_MESSAGE;
  }
}

export async function getInsightsData(userId: string) {
  const supabase = await createClient();

  const [
    commitRes,
    profileRes,
    sessionsRes,
    penaltiesRes,
    allSessionsRes,
    monthSessionsRes,
    priorMonthSessionsRes,
  ] = await Promise.all([
    supabase
      .from("commitments")
      .select("*")
      .eq("user_id", userId)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    (() => {
      const today = new Date();
      const monday = getMonday(today);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return supabase
        .from("sessions")
        .select("scheduled_date, checked_in, missed")
        .eq("user_id", userId)
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
        .eq("user_id", userId)
        .gte("charged_at", start.toISOString())
        .lte("charged_at", end.toISOString());
    })(),
    supabase
      .from("sessions")
      .select("scheduled_date, checked_in, missed")
      .eq("user_id", userId)
      .order("scheduled_date", { ascending: false })
      .limit(200),
    (() => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return supabase
        .from("sessions")
        .select("scheduled_date, checked_in, missed")
        .eq("user_id", userId)
        .gte("scheduled_date", start.toISOString().split("T")[0])
        .lte("scheduled_date", end.toISOString().split("T")[0]);
    })(),
    (() => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return supabase
        .from("sessions")
        .select("scheduled_date, checked_in, missed")
        .eq("user_id", userId)
        .gte("scheduled_date", start.toISOString().split("T")[0])
        .lte("scheduled_date", end.toISOString().split("T")[0]);
    })(),
  ]);

  const c = commitRes.data;
  const rawTier = c?.tier;
  const tierId = (process.env.NODE_ENV === "development" && process.env.INSIGHTS_TIER_OVERRIDE)
    ? normalizeTierId(process.env.INSIGHTS_TIER_OVERRIDE)
    : normalizeTierId(rawTier);
  const sessionsGoal = c?.goal_frequency ?? 3;
  const onusPoints = Math.round(Number(c?.reward_balance ?? 0));
  const onusPointsRedemptionValue = (onusPoints / 100).toFixed(2);
  const why = c?.why ?? "";
  const graceSessionsUsed =
    (c?.grace_sessions_total ?? 0) - (c?.grace_sessions_remaining ?? 0);

  let userName = "there";
  if (profileRes.data?.full_name) {
    userName = profileRes.data.full_name.split(" ")[0];
  }

  const thisWeekSessions = sessionsRes.data ?? [];
  const sessionsThisWeek = thisWeekSessions.filter((s) => s.checked_in).length;

  const monthPenalties = penaltiesRes.data ?? [];
  const penaltiesCharged = monthPenalties.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  const missesThisMonth = monthPenalties.length;

  const streak = computeStreak(allSessionsRes.data ?? []);
  const recentPattern = computeRecentPattern(allSessionsRes.data ?? []);
  const weeksConsistent = computeWeeksConsistent(
    allSessionsRes.data ?? [],
    sessionsGoal
  );
  const nextTier = getNextTier(tierId);
  const tiers = await getSelectableTiers();
  const nextTierData = nextTier ? tiers.find((t) => t.id === nextTier) : null;
  const nextTierPenalty = nextTierData?.penaltyPerMiss ?? 0;
  const nextTierRewardRate =
    nextTier === "committed" ? "0.75" : nextTier === "dedicated" ? "1" : "0.5";

  const monthSessions = monthSessionsRes.data ?? [];
  const priorMonthSessions = priorMonthSessionsRes.data ?? [];
  const monthCompleted = monthSessions.filter((s) => s.checked_in).length;
  const monthTotal = monthSessions.length;
  const isFirstMonth = priorMonthSessions.length === 0;

  const byWeekThisMonth = new Map<string, number>();
  for (const s of monthSessions) {
    if (s.checked_in) {
      const key = getMonday(new Date(s.scheduled_date))
        .toISOString()
        .split("T")[0];
      byWeekThisMonth.set(key, (byWeekThisMonth.get(key) ?? 0) + 1);
    }
  }
  const bestWeekCount = byWeekThisMonth.size
    ? Math.max(...byWeekThisMonth.values())
    : 0;
  const bestWeek = bestWeekCount > 0 ? `${bestWeekCount} sessions` : "—";

  const priorCompleted = priorMonthSessions.filter((s) => s.checked_in).length;
  const priorTotal = priorMonthSessions.length;
  let comparedToPriorMonth = "same";
  if (priorTotal > 0 && monthTotal > 0) {
    const currRate = monthCompleted / monthTotal;
    const priorRate = priorCompleted / priorTotal;
    comparedToPriorMonth =
      currRate > priorRate ? "better" : currRate < priorRate ? "worse" : "same";
  }

  const now = new Date();
  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthName = nextMonthDate.toLocaleDateString("en-US", {
    month: "long",
  });

  const coachingContext = {
    userName,
    tier: tierId,
    goalFrequency: sessionsGoal,
    currentStreak: streak,
    sessionsThisWeek,
    sessionsGoal,
    missesThisMonth,
    why: why || SEEDED_COACHING_CONTEXT.why,
    recentPattern,
  };

  const finalContext =
    !c || !why
      ? { ...SEEDED_COACHING_CONTEXT, ...coachingContext, userName: coachingContext.userName }
      : coachingContext;

  const coachingMessage = await fetchCoachingMessage(finalContext);

  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const monthlySummaryContext = {
    month: monthName,
    nextMonth: nextMonthName,
    sessionsCompleted: monthCompleted,
    sessionsTotal: monthTotal,
    missesCount: missesThisMonth,
    penaltiesCharged,
    onusPoints,
    onusPointsRedemptionValue,
    streakAtMonthEnd: streak,
    bestWeek,
    comparedToPriorMonth,
    isFirstMonth,
  };

  return {
    userName,
    streak,
    tierId,
    tierName:
      tierId === "starter"
        ? "Starter"
        : tierId === "committed"
          ? "Committed"
          : "Dedicated",
    coachingMessage,
    coachingGeneratedDate: generatedDate,
    monthlySummaryContext,
    weeksConsistent,
    graceSessionsUsed,
    nextTier,
    nextTierPenalty,
    nextTierRewardRate,
  };
}
