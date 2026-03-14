export type TierId = "starter" | "committed" | "dedicated";

export interface Tier {
  id: TierId;
  name: string;
  priceMonthly: number;
  penaltyPerMiss: number;
  firstMonthFree?: boolean;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Commitment {
  tierId: TierId;
  goal: string;
  sessionsPerWeek: number;
  penaltyPerMiss: number;
  graceSessionsRemaining: number;
  graceSessionsTotal: number;
}

export type SessionStatus = "done" | "missed" | "rest" | "today";

export interface Session {
  date: string;
  status: SessionStatus;
}

export interface Penalty {
  id: string;
  amount: number;
  date: string;
  reason: string;
}

export interface WeekSummary {
  id: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  sessionsCompleted: number;
  sessionsMissed: number;
  penaltiesCharged: number;
  missedDays?: string[];
}

export interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "discount" | "credit" | "partner";
}

export type RewardCategoryIcon = "gym" | "penalty" | "supplements" | "devices" | "gift";

export interface RewardCategory {
  id: string;
  label: string;
  subtext: string;
  icon: RewardCategoryIcon;
  partners: string[] | null;
  ctaText?: string;
}
