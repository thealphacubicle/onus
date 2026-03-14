"use client";

import { Lock } from "lucide-react";
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
    <div className="grid grid-cols-2 gap-8">
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
      {/* Onus One — locked, not selectable, always last */}
      <div
        className="flex cursor-not-allowed flex-col items-center justify-center rounded-[10px] border border-[rgba(180,83,9,0.6)] bg-[#1a1a1d] p-6 opacity-60"
        aria-hidden
      >
        <h3 className="font-medium text-[#f0efe8]">Onus One</h3>
        <p className="mt-1 text-center text-sm text-[rgba(240,239,232,0.6)]">
          $4.50/mo · 2× rewards · 5 grace sessions/month
        </p>
        <div className="mt-6 flex flex-col items-center">
          <Lock className="size-10 text-[#b45309]" strokeWidth={1.5} />
          <p className="mt-2 text-sm font-medium text-[#f0efe8]">
            Earn this after 180 days
          </p>
          <p className="mt-1 text-center text-xs text-[rgba(240,239,232,0.45)]">
            Stay consistent on any plan to unlock
          </p>
        </div>
      </div>
    </div>
  );
}
