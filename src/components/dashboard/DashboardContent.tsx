"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { WeekView } from "@/components/dashboard/WeekView";
import { PaktCard } from "@/components/dashboard/PaktCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DayStatus } from "@/components/dashboard/WeekView";
import type { Commitment, Tier, TierPointsConfig } from "@/lib/types";

interface DayData {
  date: string;
  dayName: string;
  status: DayStatus;
}

interface DashboardContentProps {
  userName: string;
  streak: number;
  sessionsThisWeek: number;
  sessionsGoal: number;
  penaltiesCharged: number;
  onusPoints: number;
  pointsEarnedThisMonth: number;
  pointsCap: number;
  weekDays: DayData[];
  commitment: Commitment;
  tiers: Tier[];
  tierPointsConfig?: Record<string, TierPointsConfig>;
}

export function DashboardContent({
  userName,
  streak,
  sessionsThisWeek,
  sessionsGoal,
  penaltiesCharged,
  onusPoints,
  pointsEarnedThisMonth,
  pointsCap,
  weekDays,
  commitment,
  tiers,
  tierPointsConfig = {},
}: DashboardContentProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const hasToday = weekDays.some((d) => d.status === "today");

  return (
    <DashboardLayout userName={userName} streak={streak}>
      <StatsRow
        sessionsThisWeek={sessionsThisWeek}
        sessionsGoal={sessionsGoal}
        penaltiesCharged={penaltiesCharged}
        onusPoints={onusPoints}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WeekView
          days={weekDays}
          canCheckIn={hasToday}
          onCheckIn={() => setCheckInOpen(true)}
        />
        <PaktCard
          commitment={commitment}
          tiers={tiers}
          tierPointsConfig={tierPointsConfig}
          canCheckIn={hasToday}
          pointsEarnedThisMonth={pointsEarnedThisMonth}
          pointsCap={pointsCap}
        />
      </div>

      <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#f0efe8]">
              Check in via the app
            </DialogTitle>
            <DialogDescription className="text-[rgba(240,239,232,0.8)]">
              To check in for your session, open the Onus app on your phone.
              You&apos;ll be able to confirm your workout right after you finish.
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-lg bg-[#c8f060]/20 px-4 py-3 text-sm font-medium text-[#c8f060]">
            App is coming soon!
          </p>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
