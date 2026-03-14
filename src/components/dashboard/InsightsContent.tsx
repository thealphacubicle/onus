"use client";

import { CoachingCard } from "@/components/dashboard/CoachingCard";
import { InsightLockedCard } from "@/components/dashboard/InsightLockedCard";
import { UpgradeNudge } from "@/components/dashboard/UpgradeNudge";
import type { TierId } from "@/lib/types";

const WEEKLY_COACHING_PREVIEW =
  "You've missed Wednesday three weeks running. That's not bad luck — that's a pattern. Wednesday might not be your day. Let's look at moving it before it costs you again.";

const MONTHLY_REVIEW_PREVIEW =
  "11 of 12 sessions. Your best week was 4. You're building something real. Next month: lock in those high-risk days before they cost you.";

interface InsightsContentProps {
  tierId: TierId;
  tierName: string;
  coachingMessage: string;
  coachingGeneratedDate: string;
  monthlySummaryContext?: {
    month: string;
    nextMonth: string;
    sessionsCompleted: number;
    sessionsTotal: number;
    missesCount: number;
    penaltiesCharged: number;
    rewardsEarned: number;
    streakAtMonthEnd: number;
    bestWeek: string;
    comparedToPriorMonth: string;
    isFirstMonth: boolean;
  };
  weeksConsistent?: number;
  graceSessionsUsed?: number;
  nextTier?: TierId | null;
  nextTierPenalty?: number;
  nextTierRewardRate?: string;
  userName?: string;
}

export function InsightsContent({
  tierId,
  tierName,
  coachingMessage,
  coachingGeneratedDate,
  monthlySummaryContext,
  weeksConsistent = 0,
  graceSessionsUsed = 0,
  nextTier = null,
  nextTierPenalty = 0,
  nextTierRewardRate = "0.5",
  userName = "there",
}: InsightsContentProps) {
  const normalizedTier = (tierId ?? "committed").toString().toLowerCase() as TierId;
  const hasWeeklyCoaching = normalizedTier === "committed" || normalizedTier === "dedicated";
  const hasMonthlyReview = normalizedTier === "dedicated";

  return (
    <div className="space-y-10">
      {/* Weekly coaching — Committed+ */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Weekly coaching
        </h2>
        {hasWeeklyCoaching ? (
          <CoachingCard
            message={coachingMessage}
            generatedDate={coachingGeneratedDate}
            tierName={tierName}
            tierId={normalizedTier}
          />
        ) : (
          <InsightLockedCard
            featureName="Weekly coaching"
            requiredTier="committed"
            teaserText="Committed members get personalized weekly check-ins based on their patterns and progress."
            previewSnippet={WEEKLY_COACHING_PREVIEW}
          />
        )}
      </section>

      {/* Monthly review — Dedicated only */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Monthly review
        </h2>
        {hasMonthlyReview && monthlySummaryContext ? (
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
            <p className="font-serif text-[15px] leading-[1.8] text-[rgba(240,239,232,0.85)]">
              Your monthly summary appears at the start of each new month. Check
              back at the beginning of {monthlySummaryContext.nextMonth} for your
              full review.
            </p>
            <p className="mt-4 text-xs text-[rgba(240,239,232,0.45)]">
              {monthlySummaryContext.sessionsCompleted} of{" "}
              {monthlySummaryContext.sessionsTotal} sessions this month
            </p>
          </div>
        ) : (
          <InsightLockedCard
            featureName="Monthly review"
            requiredTier="dedicated"
            teaserText="Dedicated members get an honest AI narrative at the start of each month — your stats, your patterns, and what to focus on next."
            previewSnippet={MONTHLY_REVIEW_PREVIEW}
          />
        )}
      </section>

      {/* Upgrade nudge — when eligible for next tier */}
      {nextTier && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Ready for the next tier?
          </h2>
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
            <UpgradeNudge
              userName={userName}
              currentTier={normalizedTier}
              weeksConsistent={weeksConsistent}
              graceSessionsUsed={graceSessionsUsed}
              nextTier={nextTier}
              nextTierPenalty={nextTierPenalty}
              nextTierRewardRate={nextTierRewardRate}
              tierName={tierName}
            />
          </div>
        </section>
      )}

      {/* Missed session reflections — link to History */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Missed session reflections
        </h2>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <p className="font-serif text-[15px] leading-[1.8] text-[rgba(240,239,232,0.85)]">
            When you miss a session, you get an honest reflection — not guilt,
            but clarity on how to recover. Expand any penalty row in your{" "}
            <a
              href="/history"
              className="text-[#c8f060] hover:underline"
            >
              History
            </a>{" "}
            to see it.
          </p>
        </div>
      </section>
    </div>
  );
}
