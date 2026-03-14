"use client";

import type { Commitment } from "@/lib/types";
import { TIERS } from "@/lib/mock-data";

interface ContractSummaryProps {
  commitment: Commitment;
  onConfirm: () => void;
}

export function ContractSummary({ commitment, onConfirm }: ContractSummaryProps) {
  const tier = TIERS.find((t) => t.id === commitment.tierId);

  return (
    <div className="mx-auto max-w-lg rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-8">
      <h3 className="text-lg font-medium text-[#f0efe8]">
        Your commitment contract
      </h3>
      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Goal
          </p>
          <p className="mt-1 text-[#f0efe8]">{commitment.goal}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Tier
          </p>
          <p className="mt-1 font-medium text-[#f0efe8]">{tier?.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Penalty per miss
          </p>
          <p className="mt-1 font-mono font-medium text-[#f07070]">
            ${commitment.penaltyPerMiss}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Grace sessions
          </p>
          <p className="mt-1 font-mono text-[#f0efe8]">
            {commitment.graceSessionsRemaining} of {commitment.graceSessionsTotal}{" "}
            remaining
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="mt-8 w-full rounded-lg bg-[#c8f060] py-3 font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
      >
        Confirm & start
      </button>
    </div>
  );
}
