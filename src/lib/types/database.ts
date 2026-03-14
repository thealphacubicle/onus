export type TierName = "starter" | "committed" | "dedicated" | "onus_one";

export interface TierConfig {
  name: string;
  price: number;
  firstMonthFree: boolean;
  penalty: number;
  pointsRate: number;
  pointsCapPerMonth: number;
  pointsCapDollarValue: number;
  graceSessions: number;
  aiCoaching: string;
  weeklyCheckin: boolean;
  monthlyReview: boolean;
  dailyCoaching: boolean;
  communityAccess: boolean;
  onusOneEligible: boolean;
  earnedOnly?: boolean;
  poolFunded?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Commitment {
  id: string;
  user_id: string;
  tier: TierName;
  goal_frequency: number;
  goal_description: string | null;
  penalty_amount: number;
  grace_sessions_remaining: number;
  grace_sessions_total: number;
  onus_points?: number;
  onus_points_cap?: number;
  active: boolean;
  created_at: string;
  why: string | null;
  reward_balance?: number;
}

export interface Session {
  id: string;
  user_id: string;
  commitment_id: string;
  scheduled_date: string;
  checked_in: boolean;
  checked_in_at: string | null;
  missed: boolean;
  penalty_charged: number;
  grace_used: boolean;
  points_earned?: number;
  comeback_bonus?: boolean;
  created_at: string;
}

export interface Penalty {
  id: string;
  user_id: string;
  session_id: string;
  amount: number;
  charged_at: string;
  refunded: boolean;
  points_to_pool?: number;
  ai_reflection?: string | null;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<UserProfile, "id">>;
      };
      commitments: {
        Row: Commitment;
        Insert: Omit<Commitment, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Commitment, "id" | "user_id">>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Session, "id" | "user_id">>;
      };
      penalties: {
        Row: Penalty;
        Insert: Omit<Penalty, "id"> & { id?: string };
        Update: Partial<Omit<Penalty, "id" | "user_id">>;
      };
      payment_methods: {
        Row: PaymentMethod;
        Insert: Omit<PaymentMethod, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PaymentMethod, "id" | "user_id">>;
      };
    };
  };
}
