"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { RewardIcon } from "@/components/rewards/RewardIcons";
import {
  MOCK_PENALTY_BALANCE,
  MOCK_PENALTY_RECOVERABLE,
  REWARD_CATEGORIES,
} from "@/lib/mock-data";
import { Gift } from "lucide-react";

interface RewardsContentProps {
  onusPoints: number;
  pointsToNextRedemption: number;
  onusPointsRedemptionValue: number;
  userName: string;
  streak: number;
}

export function RewardsContent({
  onusPoints,
  pointsToNextRedemption,
  onusPointsRedemptionValue,
  userName,
  streak,
}: RewardsContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRedeem = (pts: number, dollarValue: number) => {
    toast.success(
      `${pts.toLocaleString()} pts redeemed — $${dollarValue.toFixed(2)} credit incoming. Check your email within 24 hours.`
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar variant="dashboard" userName={userName} streak={streak} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-[#f0efe8]">Rewards</h1>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            Earn OnusPoints when you show up. Redeem for discounts and gear.
            Functionality coming soon.
          </p>

          {/* Balance card */}
          <div className="mt-8 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#c8f060]/20">
                <Gift className="size-7 text-[#c8f060]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
                  Your balance
                </p>
                <p className="font-mono text-[36px] font-medium text-[#c8f060]">
                  {onusPoints.toLocaleString()} pts
                </p>
                <p className="mt-1 text-base text-[rgba(240,239,232,0.45)]">
                  ${onusPointsRedemptionValue.toFixed(2)} redemption value
                </p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-xs text-[rgba(240,239,232,0.45)]">
                    Next redemption
                  </span>
                  <span
                    className={
                      onusPoints >= 500
                        ? "text-xs font-medium text-[#c8f060]"
                        : "text-xs text-[rgba(240,239,232,0.45)]"
                    }
                  >
                    {onusPoints >= 500
                      ? "Ready to redeem"
                      : `${pointsToNextRedemption.toLocaleString()} pts to go`}
                  </span>
                </div>
                <div
                  className="mt-2 h-[3px] w-full overflow-hidden rounded-[99px]"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-[99px] bg-[#c8f060]"
                    style={{
                      width: `${Math.min(100, (onusPoints % 500 / 500) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Redemption minimum notice */}
          <div className="mt-4 rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-4">
            <p className="text-sm text-[rgba(240,239,232,0.7)]">
              Minimum redemption is 500 points ($5.00 value). Points expire
              after 12 months of inactivity.
            </p>
          </div>

          {/* Redemption categories */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {REWARD_CATEGORIES.map((category) => {
              const isExpanded = expandedId === category.id;
              const isPenalty = category.id === "penalty";

              return (
                <div
                  key={category.id}
                  className={`cursor-pointer rounded-[12px] border bg-[#1a1a1d] p-5 transition-all ${
                    isExpanded
                      ? "border-[#c8f060] shadow-[0_0_0_1px_#c8f060]"
                      : "border-[rgba(255,255,255,0.07)]"
                  }`}
                  onClick={() =>
                    setExpandedId(isExpanded ? null : category.id)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#c8f060]/20">
                      <RewardIcon
                        icon={category.icon}
                        className="size-6 text-[#c8f060]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-[#f0efe8]">
                        {category.label}
                      </h3>
                      <p className="mt-0.5 text-sm text-[rgba(240,239,232,0.6)]">
                        {category.subtext}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      className="mt-5 space-y-4 border-t border-[rgba(255,255,255,0.07)] pt-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isPenalty ? (
                        <>
                          <div className="space-y-1">
                            <p className="text-sm text-[rgba(240,239,232,0.6)]">
                              Penalty balance:{" "}
                              <span className="font-mono text-[#f07070]">
                                ${MOCK_PENALTY_BALANCE.toFixed(2)}
                              </span>
                            </p>
                            <p className="text-sm text-[rgba(240,239,232,0.6)]">
                              You can recover:{" "}
                              <span className="font-mono text-[#c8f060]">
                                ${MOCK_PENALTY_RECOVERABLE.toFixed(2)}
                              </span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRedeem(
                                category.minPts ?? 500,
                                category.minPtsDollarValue ?? 5
                              )
                            }
                            className="group w-full rounded-lg bg-[#c8f060] py-2.5 font-medium text-[#0e0e10] transition-all hover:bg-[#1a1a1d] hover:text-[#c8f060]"
                          >
                            <span className="group-hover:hidden">
                              Redeem {(category.minPts ?? 500).toLocaleString()}{" "}
                              pts → $
                              {(category.minPtsDollarValue ?? 5).toFixed(0)}{" "}
                              credit
                            </span>
                            <span className="hidden group-hover:inline text-[#c8f060]">
                              Integration coming soon!
                            </span>
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {category.partners?.map((partner) => (
                              <span
                                key={partner}
                                className="rounded-[99px] border border-[rgba(255,255,255,0.1)] bg-[#111113] px-3 py-1 text-xs text-[rgba(240,239,232,0.7)]"
                              >
                                {partner}
                              </span>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {category.partners?.map((partner) => (
                              <button
                                key={partner}
                                type="button"
                                onClick={() =>
                                  handleRedeem(
                                    category.minPts ?? 500,
                                    category.minPtsDollarValue ?? 5
                                  )
                                }
                                className="group w-full rounded-lg bg-[#c8f060] py-2.5 font-medium text-[#0e0e10] transition-all hover:bg-[#1a1a1d] hover:text-[#c8f060]"
                              >
                                <span className="group-hover:hidden">
                                  Redeem {(category.minPts ?? 500).toLocaleString()}{" "}
                                  pts → $
                                  {(category.minPtsDollarValue ?? 5).toFixed(0)}{" "}
                                  credit
                                </span>
                                <span className="hidden group-hover:inline text-[#c8f060]">
                                  Integration coming soon!
                                </span>
                              </button>
                            ))}
                          </div>
                          {category.ctaText && (
                            <button
                              type="button"
                              className="group inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-4 py-2 text-sm text-[rgba(240,239,232,0.6)] transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[#1a1a1d]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="group-hover:hidden">
                                {category.ctaText}
                              </span>
                              <span className="hidden group-hover:inline text-[#c8f060]">
                                Integration coming soon!
                              </span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
