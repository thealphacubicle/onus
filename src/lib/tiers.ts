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

function getFallbackTiers(): {
  tiers: Tier[];
  pricingDetails: PricingTierDetail[];
} {
  const { TIERS, PRICING_TIER_DETAILS } = require("@/lib/mock-data");
  return {
    tiers: TIERS,
    pricingDetails: PRICING_TIER_DETAILS,
  };
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
  const { TIER_POINTS_CONFIG } = require("@/lib/mock-data");
  const config: Record<string, TierPointsConfig> = {};
  for (const [key, val] of Object.entries(TIER_POINTS_CONFIG)) {
    const dbKey = key === "onusOne" ? "onus_one" : key;
    config[dbKey] = val as TierPointsConfig;
  }
  return config;
}
