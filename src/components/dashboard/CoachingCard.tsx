"use client";

import { useEffect, useState } from "react";
import { TierTease } from "@/components/ai/TierTease";
import { formatAiMessage } from "@/lib/utils";
import type { TierId } from "@/lib/types";

const STARTER_TEASE =
  "Committed members see patterns like this before they become misses.";
const COMMITTED_TEASE =
  "On Dedicated, I flag this kind of pattern before it costs you.";

const STARTER_PREVIEW =
  "You've missed Wednesday three weeks running. That's not bad luck — that's a pattern. Wednesday might not be your day. Let's look at moving it before it costs you again.";

const COMMITTED_PREVIEW =
  "Tomorrow is your highest-risk session based on the last 6 weeks. You tend to skip Fridays after a heavy Thursday. I'd reschedule it to Saturday morning before 10am. Here's why that works for you.";

const TIER_ORDER: TierId[] = ["starter", "committed", "dedicated"];

function getNextTier(current: TierId): TierId | null {
  const idx = TIER_ORDER.indexOf(current);
  if (idx === -1 || idx === TIER_ORDER.length - 1) return null;
  return TIER_ORDER[idx + 1];
}

const COMMITTED_TEASE_KEY = "onus_committed_tease_shown";

function shouldShowCommittedTease(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(COMMITTED_TEASE_KEY);
    if (!raw) return true;
    const last = new Date(raw);
    const now = new Date();
    return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
  } catch {
    return true;
  }
}

function setCommittedTeaseShown(): void {
  try {
    localStorage.setItem(COMMITTED_TEASE_KEY, new Date().toISOString());
  } catch {
    // ignore
  }
}

interface CoachingCardProps {
  message: string;
  generatedDate: string;
  tierName: string;
  tierId: TierId;
  isLoading?: boolean;
}

export function CoachingCard({
  message,
  generatedDate,
  tierName,
  tierId,
  isLoading = false,
}: CoachingCardProps) {
  const [committedTeaseShown, setCommittedTeaseShownState] = useState(false);

  useEffect(() => {
    if (tierId === "committed") {
      const show = shouldShowCommittedTease();
      setCommittedTeaseShownState(show);
      if (show) {
        setCommittedTeaseShown();
      }
    }
  }, [tierId]);

  const nextTier = getNextTier(tierId);
  const showStarterTease = tierId === "starter" && nextTier === "committed";
  const showCommittedTease =
    tierId === "committed" && nextTier === "dedicated" && committedTeaseShown;

  return (
    <div className="space-y-0">
      <div className="relative flex rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] pl-6 pr-6 pt-6 pb-6">
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] rounded-none bg-[#c8f060]"
          aria-hidden
        />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
              This week
            </span>
            <span className="text-xs text-[rgba(240,239,232,0.45)]">
              {generatedDate}
            </span>
          </div>
          {isLoading ? (
            <div className="mt-4 space-y-2 font-serif">
              <div className="h-4 w-4/5 animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[rgba(240,239,232,0.2)]" />
            </div>
          ) : (
            <p
              className="mt-4 font-serif text-[15px] leading-[1.8]"
              style={{ color: "rgba(240,239,232,0.85)" }}
            >
              {formatAiMessage(message)}
            </p>
          )}
          <div className="mt-4">
            <span className="rounded-full px-2.5 py-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              {tierName}
            </span>
          </div>
        </div>
      </div>

      {showStarterTease && (
        <div className="mt-6">
          <p
            className="mb-4 font-serif text-sm italic"
            style={{ color: "rgba(240,239,232,0.45)" }}
          >
            {STARTER_TEASE}
          </p>
          <TierTease
            currentTier="starter"
            nextTier="committed"
            featurePreview={STARTER_PREVIEW}
          />
        </div>
      )}

      {showCommittedTease && (
        <div className="mt-6">
          <p
            className="mb-4 font-serif text-sm italic"
            style={{ color: "rgba(240,239,232,0.45)" }}
          >
            {COMMITTED_TEASE}
          </p>
          <TierTease
            currentTier="committed"
            nextTier="dedicated"
            featurePreview={COMMITTED_PREVIEW}
          />
        </div>
      )}
    </div>
  );
}
