"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { WeekView } from "@/components/dashboard/WeekView";
import { CoachingCard } from "@/components/dashboard/CoachingCard";
import { PaktCard } from "@/components/dashboard/PaktCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DayStatus } from "@/components/dashboard/WeekView";
import type { Commitment, Tier } from "@/lib/types";

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
  rewardsEarned: number;
  weekDays: DayData[];
  commitment: Commitment;
  tiers: Tier[];
  coachingMessage: string;
}

export function DashboardContent({
  userName,
  streak,
  sessionsThisWeek,
  sessionsGoal,
  penaltiesCharged,
  rewardsEarned,
  weekDays,
  commitment,
  tiers,
  coachingMessage,
}: DashboardContentProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const hasToday = weekDays.some((d) => d.status === "today");

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar variant="dashboard" userName={userName} streak={streak} />
        <main className="flex-1 p-6">
          <StatsRow
            sessionsThisWeek={sessionsThisWeek}
            sessionsGoal={sessionsGoal}
            penaltiesCharged={penaltiesCharged}
            rewardsEarned={rewardsEarned}
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WeekView
              days={weekDays}
              canCheckIn={hasToday}
              onCheckIn={() => setCheckInOpen(true)}
            />
            <CoachingCard message={coachingMessage} />
          </div>
          <div className="mt-6">
            <PaktCard
              commitment={commitment}
              tiers={tiers}
              canCheckIn={hasToday}
            />
          </div>
        </main>
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
    </div>
  );
}
