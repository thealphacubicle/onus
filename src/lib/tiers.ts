import { createClient } from "@/lib/supabase/server";
import type { Tier, TierPointsConfig } from "@/lib/types";

export interface PricingTierDetail {
  id: string;
  name?: string;
  priceMonthly?: number;
  penaltyPerMiss?: number | null;
  badge: string;
  badgeVariant: "green" | "blue" | "amber" | "gold";
  goalRange: string;
  graceSessions: string;
  aiCoaching: string;
  rewardRate: string;
  rewardCap: string;
  weeklyCheckIn: boolean | "n/a";
  monthlyReview: boolean;
  onusOneEligible: string;
  ctaText: string;
  ctaVariant: "accent" | "outline";
}

interface TierRow {
  id: string;
  name: string;
  price_monthly: number;
  penalty_per_miss: number | null;
  first_month_free: boolean;
  description: string;
  badge: string;
  badge_variant: string;
  goal_range: string;
  grace_sessions: string;
  ai_coaching: string;
  reward_rate: string;
  reward_cap: string;
  weekly_check_in: string;
  monthly_review: boolean;
  onus_one_eligible: string;
  cta_text: string;
  cta_variant: string;
  selectable: boolean;
  points_rate?: number | null;
  points_cap_per_month?: number | null;
  points_cap_dollar_value?: number | null;
}

function rowToTier(row: TierRow): Tier {
  return {
    id: row.id as Tier["id"],
    name: row.name,
    priceMonthly: Number(row.price_monthly),
    penaltyPerMiss: row.penalty_per_miss ?? 0,
    firstMonthFree: row.first_month_free,
    description: row.description,
  };
}

function rowToPricingDetail(row: TierRow): PricingTierDetail {
  const weeklyCheckIn =
    row.weekly_check_in === "n/a"
      ? ("n/a" as const)
      : row.weekly_check_in === "yes";
  return {
    id: row.id,
    name: row.name,
    priceMonthly: Number(row.price_monthly),
    penaltyPerMiss: row.penalty_per_miss,
    badge: row.badge,
    badgeVariant: row.badge_variant as PricingTierDetail["badgeVariant"],
    goalRange: row.goal_range,
    graceSessions: row.grace_sessions,
    aiCoaching: row.ai_coaching,
    rewardRate: row.reward_rate,
    rewardCap: row.reward_cap,
    weeklyCheckIn,
    monthlyReview: row.monthly_review,
    onusOneEligible: row.onus_one_eligible,
    ctaText: row.cta_text,
    ctaVariant: row.cta_variant as PricingTierDetail["ctaVariant"],
  };
}

export async function getTiers(): Promise<{
  tiers: Tier[];
  pricingDetails: PricingTierDetail[];
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tiers")
      .select("*");

    const tierOrder = ["starter", "committed", "dedicated", "onus_one"] as const;

    if (error || !data?.length) {
      return getFallbackTiers();
    }

    const rows = (data as TierRow[]).sort(
      (a, b) => tierOrder.indexOf(a.id as typeof tierOrder[number]) - tierOrder.indexOf(b.id as typeof tierOrder[number])
    );
    const selectableRows = rows.filter((r) => r.selectable);
    const tiers = selectableRows.map(rowToTier);
    const pricingDetails = rows.map(rowToPricingDetail);

    return { tiers, pricingDetails };
  } catch {
    return getFallbackTiers();
  }
}

const AI_COACHING_LABELS: Record<string, string> = {
  goal_builder_only: "Goal builder only",
  weekly: "Weekly coaching",
  daily: "Daily coaching",
  daily_plus_insights: "Daily + insights + habit stacking",
};

function getFallbackTiers(): {
  tiers: Tier[];
  pricingDetails: PricingTierDetail[];
} {
  const { TIERS } = require("@/lib/mock-data");
  const tierOrder = ["starter", "committed", "dedicated"] as const;
  const tierDescriptions: Record<string, string> = {
    starter:
      "For building the habit. Low stakes to start — but the commitment is still real.",
    committed:
      "For people ready to stop making excuses. Earn OnusPoints on every session you show up for.",
    dedicated:
      "For when you're done playing around. Earn OnusPoints at the highest standard rate.",
  };
  const tiers: Tier[] = tierOrder.map((id) => {
    const t = TIERS[id];
    return {
      id,
      name: t.name,
      priceMonthly: t.price,
      penaltyPerMiss: t.penalty,
      firstMonthFree: t.firstMonthFree,
      graceSessions: t.graceSessions,
      pointsRate: t.pointsRate,
      pointsCapPerMonth: t.pointsCapPerMonth,
      pointsCapDollarValue: t.pointsCapDollarValue,
      aiCoaching: t.aiCoaching,
      weeklyCheckin: t.weeklyCheckin,
      monthlyReview: t.monthlyReview,
      description: tierDescriptions[id],
    };
  });
  const pricingDetails: PricingTierDetail[] = tierOrder.map((id) => {
    const t = TIERS[id];
    return {
      id,
      name: t.name,
      priceMonthly: t.price,
      penaltyPerMiss: t.penalty,
      badge: id === "starter" ? "First month free" : id === "committed" ? "Most popular" : "Highest stakes",
      badgeVariant: id === "starter" ? "green" : id === "committed" ? "blue" : "amber",
      goalRange: id === "starter" ? "1–2 sessions/week" : id === "committed" ? "3–4 sessions/week" : "5–7 sessions/week",
      graceSessions: `${t.graceSessions}/month`,
      aiCoaching: AI_COACHING_LABELS[t.aiCoaching] ?? t.aiCoaching,
      rewardRate: `${t.pointsRate}× OnusPoints`,
      rewardCap: `${t.pointsCapPerMonth.toLocaleString()} pts ($${t.pointsCapDollarValue.toFixed(2)} value)`,
      weeklyCheckIn: t.weeklyCheckin,
      monthlyReview: t.monthlyReview,
      onusOneEligible: "Yes — after 180 days",
      ctaText: id === "starter" ? "Try free" : "Get started",
      ctaVariant: "accent",
    };
  });
  return { tiers, pricingDetails };
}

export async function getSelectableTiers(): Promise<Tier[]> {
  const { tiers } = await getTiers();
  return tiers;
}

export async function getTierPointsConfig(): Promise<Record<string, TierPointsConfig>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tiers")
      .select("id, points_rate, points_cap_per_month, points_cap_dollar_value");

    if (error || !data?.length) {
      return getFallbackTierPointsConfig();
    }

    const config: Record<string, TierPointsConfig> = {};
    for (const row of data as { id: string; points_rate?: number | null; points_cap_per_month?: number | null; points_cap_dollar_value?: number | null }[]) {
      if (row.points_rate != null && row.points_cap_per_month != null && row.points_cap_dollar_value != null) {
        config[row.id] = {
          pointsRate: Number(row.points_rate),
          pointsCapPerMonth: Number(row.points_cap_per_month),
          pointsCapDollarValue: Number(row.points_cap_dollar_value),
        };
      }
    }
    return Object.keys(config).length > 0 ? config : getFallbackTierPointsConfig();
  } catch {
    return getFallbackTierPointsConfig();
  }
}

function getFallbackTierPointsConfig(): Record<string, TierPointsConfig> {
  const { TIERS } = require("@/lib/mock-data");
  const config: Record<string, TierPointsConfig> = {};
  for (const [key, t] of Object.entries(TIERS)) {
    const tier = t as { pointsRate: number; pointsCapPerMonth: number; pointsCapDollarValue: number };
    config[key] = {
      pointsRate: tier.pointsRate,
      pointsCapPerMonth: tier.pointsCapPerMonth,
      pointsCapDollarValue: tier.pointsCapDollarValue,
    };
  }
  return config;
}
