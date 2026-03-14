"use client";

import { useCallback, useEffect, useState } from "react";
import { formatAiMessage } from "@/lib/utils";

const LAST_SUMMARY_KEY = "onus_last_summary_shown";

interface MonthlySummaryProps {
  month: string;
  nextMonth: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  userName: string;
  missesCount: number;
  penaltiesCharged: number;
  rewardsEarned: number;
  streakAtMonthEnd: number;
  bestWeek: string;
  comparedToPriorMonth: string;
  isFirstMonth: boolean;
}

async function fetchSummary(context: {
  userName: string;
  month: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  missesCount: number;
  penaltiesCharged: number;
  rewardsEarned: number;
  streakAtMonthEnd: number;
  bestWeek: string;
  comparedToPriorMonth: string;
}): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "summary", context }),
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No body");
    const decoder = new TextDecoder();
    let text = "";
    const buffer: string[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer.push(decoder.decode(value, { stream: true }));
      const chunk = buffer.join("");
      const lines = chunk.split("\n");
      buffer.length = 0;
      buffer.push(lines.pop() ?? "");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line) as { text?: string };
          if (parsed.text) text += parsed.text;
        } catch {
          // skip
        }
      }
    }
    if (buffer[0]) {
      try {
        const parsed = JSON.parse(buffer[0]) as { text?: string };
        if (parsed.text) text += parsed.text;
      } catch {
        // ignore
      }
    }
    return formatAiMessage(text.trim() || "Solid month. Keep building.");
  } catch {
    return "Solid month. Keep building.";
  }
}

export function MonthlySummary({
  month,
  nextMonth,
  sessionsCompleted,
  sessionsTotal,
  userName,
  missesCount,
  penaltiesCharged,
  rewardsEarned,
  streakAtMonthEnd,
  bestWeek,
  comparedToPriorMonth,
  isFirstMonth,
}: MonthlySummaryProps) {
  const [show, setShow] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);
  const [dismissing, setDismissing] = useState(false);

  const shouldShow = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (isFirstMonth) return false;
    if (sessionsCompleted === 0) return false;
    try {
      const raw = localStorage.getItem(LAST_SUMMARY_KEY);
      if (!raw) return true;
      const last = new Date(raw);
      const now = new Date();
      return (
        now.getMonth() !== last.getMonth() ||
        now.getFullYear() !== last.getFullYear()
      );
    } catch {
      return true;
    }
  }, [isFirstMonth, sessionsCompleted]);

  useEffect(() => {
    if (!shouldShow()) return;
    setShow(true);
    fetchSummary({
      userName,
      month,
      sessionsCompleted,
      sessionsTotal,
      missesCount,
      penaltiesCharged,
      rewardsEarned,
      streakAtMonthEnd,
      bestWeek,
      comparedToPriorMonth,
    }).then((t) => {
      setNarrative(t);
      setLoading(false);
    });
  }, [
    shouldShow,
    userName,
    month,
    sessionsCompleted,
    sessionsTotal,
    missesCount,
    penaltiesCharged,
    rewardsEarned,
    streakAtMonthEnd,
    bestWeek,
    comparedToPriorMonth,
  ]);

  const dismiss = () => {
    setDismissing(true);
    try {
      localStorage.setItem(LAST_SUMMARY_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c]"
      style={{
        opacity: dismissing ? 0 : 1,
        transition: "opacity 400ms ease-out",
      }}
    >
      <div className="flex max-w-[520px] flex-col items-center px-6 text-center">
        <p className="text-[13px] font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          {month}
        </p>
        <p className="mt-4 font-medium text-[#f0efe8]" style={{ fontSize: 64 }}>
          {sessionsCompleted} of {sessionsTotal}
        </p>
        <p className="mt-2 text-[16px] text-[rgba(240,239,232,0.45)]">
          sessions this month
        </p>
        <div className="mt-6 min-h-[80px]">
          {loading ? (
            <div className="space-y-2 font-serif">
              <div className="mx-auto h-4 w-full max-w-[400px] animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
              <div className="mx-auto h-4 w-4/5 max-w-[360px] animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
              <div className="mx-auto h-4 w-3/4 max-w-[300px] animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
            </div>
          ) : (
            <p
              className="font-serif text-[18px] leading-[1.8]"
              style={{ color: "rgba(240,239,232,0.8)" }}
            >
              {narrative}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="mt-8 text-[14px] text-[rgba(240,239,232,0.45)] hover:text-[rgba(240,239,232,0.7)]"
        >
          Start {nextMonth}
        </button>
      </div>
    </div>
  );
}
