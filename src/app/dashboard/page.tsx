"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { WeekView } from "@/components/dashboard/WeekView";
import { CoachingCard } from "@/components/dashboard/CoachingCard";
import { PaktCard } from "@/components/dashboard/PaktCard";
import {
  MOCK_USER,
  MOCK_COMMITMENT,
  MOCK_DASHBOARD_STATS,
  MOCK_WEEK_DAYS,
  MOCK_COACHING_MESSAGE,
} from "@/lib/mock-data";
import type { DayStatus } from "@/components/dashboard/WeekView";

export default function DashboardPage() {
  const weekDays = MOCK_WEEK_DAYS.map((day) => ({
    ...day,
    status: day.status as DayStatus,
  }));
  const hasToday = MOCK_WEEK_DAYS.some((d) => d.status === "today");

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar
          variant="dashboard"
          userName={MOCK_USER.name.split(" ")[0]}
          streak={MOCK_DASHBOARD_STATS.streak}
        />
        <main className="flex-1 p-6">
          <StatsRow
            sessionsThisWeek={MOCK_DASHBOARD_STATS.sessionsThisWeek}
            sessionsGoal={MOCK_DASHBOARD_STATS.sessionsGoal}
            penaltiesCharged={MOCK_DASHBOARD_STATS.penaltiesCharged}
            rewardsEarned={MOCK_DASHBOARD_STATS.rewardsEarned}
          />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <WeekView
              days={weekDays}
              canCheckIn={hasToday}
            />
            <CoachingCard message={MOCK_COACHING_MESSAGE} />
          </div>
          <div className="mt-6">
            <PaktCard
              commitment={MOCK_COMMITMENT}
              canCheckIn={hasToday}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
