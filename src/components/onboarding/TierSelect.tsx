"use client";

import type { Tier } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TierSelectProps {
  tiers: Tier[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  recommendedId?: string | null;
}

export function TierSelect({ tiers, selectedId, onSelect, recommendedId }: TierSelectProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tiers.map((tier) => {
        const isRecommended = recommendedId === tier.id;
        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={cn(
              "relative rounded-[10px] border p-6 text-left transition-all",
              selectedId === tier.id
                ? "border-[#c8f060] bg-[#1a1a1d] ring-1 ring-[#c8f060]/30"
                : "border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] hover:border-[rgba(255,255,255,0.12)]",
              isRecommended && "ring-1 ring-[#c8f060]/40"
            )}
          >
            {isRecommended && (
              <span className="absolute right-4 top-4 rounded-full bg-[#c8f060] px-2.5 py-0.5 text-xs font-medium text-[#0e0e10]">
                Recommended
              </span>
            )}
            <h3 className="font-medium text-[#f0efe8]">{tier.name}</h3>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            {tier.description}
          </p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-mono text-xl font-medium text-[#f0efe8]">
              ${tier.priceMonthly.toFixed(2)}
            </span>
            <span className="text-sm text-[rgba(240,239,232,0.6)]">/mo</span>
            {tier.firstMonthFree && (
              <span className="ml-2 text-xs text-[#c8f060]">
                First month free
              </span>
            )}
          </div>
          <p className="mt-2 font-mono text-sm text-[#f07070]">
            ${tier.penaltyPerMiss} penalty per miss
          </p>
        </button>
        );
      })}
    </div>
  );
}
