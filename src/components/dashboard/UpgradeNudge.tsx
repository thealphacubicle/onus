"use client";

import Link from "next/link";
import { useState } from "react";
import { formatAiMessage } from "@/lib/utils";
import type { TierId } from "@/lib/types";

const NUDGE_DISMISSED_KEY = "onus_nudge_dismissed_at";
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

const NEXT_TIER_NAMES: Record<string, string> = {
  committed: "Committed",
  dedicated: "Dedicated",
};

const TIER_ORDER: TierId[] = ["starter", "committed", "dedicated"];

function getNextTier(current: TierId): TierId | null {
  const idx = TIER_ORDER.indexOf(current);
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

function isNudgeDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(NUDGE_DISMISSED_KEY);
    if (!raw) return false;
    const dismissedAt = new Date(raw).getTime();
    return Date.now() - dismissedAt < COOLDOWN_MS;
  } catch {
    return true;
  }
}

function setNudgeDismissed(): void {
  try {
    localStorage.setItem(NUDGE_DISMISSED_KEY, new Date().toISOString());
  } catch {
    // ignore
  }
}

async function fetchNudge(context: {
  userName: string;
  currentTier: string;
  nextTier: string;
  weeksConsistent: number;
  graceSessionsUsed: number;
  nextTierPenalty: number;
  nextTierRewardRate: string;
}): Promise<string> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature: "nudge", context }),
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = (await res.json()) as { text?: string };
    return (
      formatAiMessage(
        data.text ??
          "You've been consistent. The next level would push you harder — and reward you more."
      )
    );
  } catch {
    return "You've been consistent. The next level would push you harder — and reward you more.";
  }
}

interface UpgradeNudgeProps {
  userName: string;
  currentTier: TierId;
  weeksConsistent: number;
  graceSessionsUsed: number;
  nextTier: TierId | null;
  nextTierPenalty: number;
  nextTierRewardRate: string;
  tierName: string;
}

export function UpgradeNudge({
  userName,
  currentTier,
  weeksConsistent,
  graceSessionsUsed,
  nextTier,
  nextTierPenalty,
  nextTierRewardRate,
  tierName,
}: UpgradeNudgeProps) {
  const [slideUpOpen, setSlideUpOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const eligible =
    nextTier !== null &&
    weeksConsistent >= 4 &&
    graceSessionsUsed <= 1 &&
    !isNudgeDismissed();

  const handleBadgeClick = () => {
    if (!eligible) return;
    if (slideUpOpen) return;
    setSlideUpOpen(true);
    if (!message) {
      setLoading(true);
      fetchNudge({
        userName,
        currentTier: tierName,
        nextTier: NEXT_TIER_NAMES[nextTier] ?? nextTier,
        weeksConsistent,
        graceSessionsUsed,
        nextTierPenalty,
        nextTierRewardRate,
      }).then((t) => {
        setMessage(t);
        setLoading(false);
      });
    }
  };

  const handleMaybeLater = () => {
    setNudgeDismissed();
    setSlideUpOpen(false);
  };

  const nextTierName = nextTier ? NEXT_TIER_NAMES[nextTier] ?? nextTier : "";

  return (
    <>
      <div
        className={`flex items-center gap-2 ${eligible ? "cursor-pointer" : ""}`}
        onClick={eligible ? handleBadgeClick : undefined}
        onKeyDown={
          eligible
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") handleBadgeClick();
              }
            : undefined
        }
        role={eligible ? "button" : undefined}
        tabIndex={eligible ? 0 : undefined}
      >
        <p className="text-sm text-[rgba(240,239,232,0.8)]">
          <span className="text-[rgba(240,239,232,0.45)]">Tier:</span>{" "}
          {tierName}
        </p>
        {eligible && (
          <span
            className="size-1.5 shrink-0 rounded-full bg-[#c8f060]"
            style={{
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>
      {slideUpOpen && (
        <div
          className="mt-4 overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4 transition-[height] duration-250 ease-out"
        >
          {loading ? (
            <div className="h-4 w-3/4 animate-pulse rounded bg-[rgba(240,239,232,0.2)] font-serif" />
          ) : (
            <p
              className="font-serif text-[13px] leading-[1.7]"
              style={{ color: "rgba(240,239,232,0.75)" }}
            >
              {message}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleMaybeLater}
              className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-4 py-2 text-sm text-[rgba(240,239,232,0.8)] hover:bg-[#1a1a1d]"
            >
              Maybe later
            </button>
            <Link
              href="/pricing"
              className="rounded-lg bg-[#c8f060] px-4 py-2 text-sm font-medium text-[#0e0e10] hover:opacity-90"
            >
              See {nextTierName}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
