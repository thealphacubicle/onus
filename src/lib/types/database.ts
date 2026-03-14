import type { TierId } from "../types";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

export interface Commitment {
  id: string;
  user_id: string;
  tier: TierId;
  goal_frequency: number;
  goal_description: string | null;
  penalty_amount: number;
  grace_sessions_remaining: number;
  grace_sessions_total: number;
  reward_balance: number;
  active: boolean;
  created_at: string;
  why: string | null;
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
  created_at: string;
}

export interface Penalty {
  id: string;
  user_id: string;
  session_id: string;
  amount: number;
  charged_at: string;
  refunded: boolean;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "id">>;
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
    };
  };
}
