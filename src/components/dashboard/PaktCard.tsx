"use client";

import type { Commitment } from "@/lib/types";
import { TIERS } from "@/lib/mock-data";

interface PaktCardProps {
  commitment: Commitment;
  canCheckIn?: boolean;
}

export function PaktCard({ commitment, canCheckIn = true }: PaktCardProps) {
  const tier = TIERS.find((t) => t.id === commitment.tierId);

  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
      <h3 className="font-medium text-[#f0efe8]">Your Pakt</h3>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-[rgba(240,239,232,0.8)]">
          <span className="text-[rgba(240,239,232,0.45)]">Tier:</span>{" "}
          {tier?.name}
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
          <span className="text-[rgba(240,239,232,0.45)]">Grace sessions:</span>{" "}
          {commitment.graceSessionsRemaining} remaining
        </p>
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
