"use client";

import type { Commitment, Tier, TierPointsConfig } from "@/lib/types";

interface PaktCardProps {
  commitment: Commitment;
  tiers: Tier[];
  tierPointsConfig?: Record<string, TierPointsConfig>;
  canCheckIn?: boolean;
  pointsEarnedThisMonth?: number;
  pointsCap?: number;
}

export function PaktCard({
  commitment,
  tiers,
  tierPointsConfig = {},
  canCheckIn = true,
  pointsEarnedThisMonth = 0,
  pointsCap = 999,
}: PaktCardProps) {
  const tier = tiers.find((t) => t.id === commitment.tierId);
  const pointsConfig = tierPointsConfig[commitment.tierId];
  const progressPercent = pointsCap > 0 ? Math.min(100, (pointsEarnedThisMonth / pointsCap) * 100) : 0;

  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
      <h3 className="font-medium text-[#f0efe8]">Your Commitment</h3>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-[rgba(240,239,232,0.8)]">
          <span className="text-[rgba(240,239,232,0.45)]">Tier:</span>{" "}
          {tier?.name ?? commitment.tierId}
        </p>
        <p className="text-sm text-[rgba(240,239,232,0.8)]">
          <span className="text-[rgba(240,239,232,0.45)]">Goal:</span>{" "}
          {commitment.goal}
        </p>
        <p className="font-mono text-sm text-[#f07070]">
          <span className="text-[rgba(240,239,232,0.45)]">Penalty per miss:</span>{" "}
          ${commitment.penaltyPerMiss}
        </p>
        <p className="font-mono text-sm text-[#f0efe8]">
          <span className="text-[rgba(240,239,232,0.45)]">Points rate:</span>{" "}
          {pointsConfig?.pointsRate ?? tier?.pointsRate ?? "—"}× (
          {pointsConfig?.pointsCapPerMonth?.toLocaleString() ?? pointsCap.toLocaleString()} pts/mo
          cap)
        </p>
        <p className="font-mono text-sm text-[#f0efe8]">
          <span className="text-[rgba(240,239,232,0.45)]">Grace remaining:</span>{" "}
          {commitment.graceSessionsRemaining} / {commitment.graceSessionsTotal} this month
        </p>
        <p className="font-mono text-sm text-[#f0efe8]">
          <span className="text-[rgba(240,239,232,0.45)]">Points this month:</span>{" "}
          {pointsEarnedThisMonth.toLocaleString()} / {pointsCap.toLocaleString()} pts
        </p>
        <div
          className="mt-2 h-[3px] w-full overflow-hidden rounded-[99px]"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-[99px] bg-[#c8f060]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      {canCheckIn && (
        <p className="mt-6 text-center text-sm text-[rgba(240,239,232,0.6)]">
          Check in via the app
        </p>
      )}
      {!canCheckIn && (
        <p className="mt-6 text-center text-sm text-[#c8f060]">
          You&apos;ve checked in today. Nice work.
        </p>
      )}
    </div>
  );
}
