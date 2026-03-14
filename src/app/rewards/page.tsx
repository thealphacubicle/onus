import { createClient } from "@/lib/supabase/server";
import { RewardsContent } from "@/components/rewards/RewardsContent";
import { MOCK_ONUS_POINTS, MOCK_POINTS_TO_NEXT_REDEMPTION } from "@/lib/mock-data";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let onusPoints = MOCK_ONUS_POINTS;
  let pointsToNextRedemption = MOCK_POINTS_TO_NEXT_REDEMPTION;
  let userName = user.email?.split("@")[0] ?? "there";
  let streak = 0;

  try {
    const [commitRes, profileRes, sessionsRes] = await Promise.all([
      supabase
        .from("commitments")
        .select("reward_balance")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("sessions")
        .select("scheduled_date, checked_in, missed")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: false })
        .limit(200),
    ]);

    if (commitRes.data?.reward_balance != null) {
      const pts = Math.round(Number(commitRes.data.reward_balance));
      onusPoints = pts;
      pointsToNextRedemption =
        pts >= 500 ? 500 - (pts % 500) : 500 - pts;
    }

    if (profileRes.data?.full_name) {
      userName = profileRes.data.full_name.split(" ")[0];
    }

    const sessions = sessionsRes.data ?? [];
    const byWeek = new Map<string, { completed: boolean; missed: boolean }[]>();
    for (const s of sessions) {
      const monday = getMonday(new Date(s.scheduled_date));
      const key = monday.toISOString().split("T")[0];
      if (!byWeek.has(key)) byWeek.set(key, []);
      byWeek.get(key)!.push({
        completed: s.checked_in,
        missed: s.missed,
      });
    }

    const sortedWeeks = Array.from(byWeek.entries()).sort((a, b) =>
      b[0].localeCompare(a[0])
    );
    for (const [, weekSessions] of sortedWeeks) {
      const allDone = weekSessions.every((s) => s.completed);
      const anyMissed = weekSessions.some((s) => s.missed);
      if (allDone && !anyMissed) streak++;
      else break;
    }
  } catch {
    // Fallback to zero
  }

  const onusPointsRedemptionValue = (onusPoints / 100).toFixed(2);

  return (
    <RewardsContent
      onusPoints={onusPoints}
      pointsToNextRedemption={pointsToNextRedemption}
      onusPointsRedemptionValue={parseFloat(onusPointsRedemptionValue)}
      userName={userName}
      streak={streak}
    />
  );
}
