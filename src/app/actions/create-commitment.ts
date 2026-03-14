"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TierId } from "@/lib/types";

const DAYS_BY_FREQUENCY: Record<number, number[]> = {
  1: [1],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [1, 2, 3, 4, 5, 6, 0],
};

function getNextWeeksDates(weeks: number, dayNumbers: number[]): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + w * 7);
    const mondayOffset =
      weekStart.getDay() === 0 ? -6 : 1 - weekStart.getDay();
    const monday = new Date(weekStart);
    monday.setDate(weekStart.getDate() + mondayOffset);

    for (const dayNum of dayNumbers) {
      const sessionDate = new Date(monday);
      const offset = dayNum === 0 ? 6 : dayNum - 1;
      sessionDate.setDate(monday.getDate() + offset);
      dates.push(sessionDate.toISOString().split("T")[0]);
    }
  }

  return dates;
}

export async function createCommitment(formData: {
  tier: TierId;
  goal_frequency: number;
  goal_description: string;
  penalty_amount: number;
  grace_sessions_total: number;
  why?: string;
}): Promise<{ error?: "auth_required" }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "auth_required" };
  }

  const { data: commitment, error: commitError } = await supabase
    .from("commitments")
    .insert({
      user_id: user.id,
      tier: formData.tier,
      goal_frequency: formData.goal_frequency,
      goal_description: formData.goal_description || null,
      penalty_amount: formData.penalty_amount,
      grace_sessions_total: formData.grace_sessions_total,
      grace_sessions_remaining: formData.grace_sessions_total,
      why: formData.why || null,
    })
    .select("id")
    .single();

  if (commitError || !commitment) {
    return { error: "auth_required" };
  }

  const dayNumbers =
    DAYS_BY_FREQUENCY[formData.goal_frequency] ?? DAYS_BY_FREQUENCY[3];
  const dates = getNextWeeksDates(4, dayNumbers);

  const sessions = dates.map((scheduled_date) => ({
    user_id: user.id,
    commitment_id: commitment.id,
    scheduled_date,
  }));

  await supabase.from("sessions").insert(sessions);

  redirect("/dashboard");
}
