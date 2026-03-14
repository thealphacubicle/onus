"use client";

import { cn } from "@/lib/utils";

export type DayStatus = "done" | "missed" | "rest" | "today";

interface DayData {
  date: string;
  dayName: string;
  status: DayStatus;
}

interface WeekViewProps {
  days: DayData[];
  canCheckIn?: boolean;
}

export function WeekView({ days, canCheckIn }: WeekViewProps) {
  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[#f0efe8]">This week</h3>
        {canCheckIn && (
          <p className="text-sm text-[rgba(240,239,232,0.6)]">
            Check in via the app
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-between gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs text-[rgba(240,239,232,0.6)]">
              {day.dayName}
            </span>
            <div
              className={cn(
                "size-10 rounded-full border-2",
                day.status === "done" &&
                  "border-[#c8f060] bg-[#c8f060]/20",
                day.status === "missed" &&
                  "border-[#f07070] bg-[#f07070]/20",
                day.status === "rest" &&
                  "border-transparent bg-[rgba(255,255,255,0.05)]",
                day.status === "today" &&
                  "border-[#c8f060] bg-transparent"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
