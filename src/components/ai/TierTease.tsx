"use client";

import Link from "next/link";
import type { TierId } from "@/lib/types";

interface TierTeaseProps {
  currentTier: TierId;
  nextTier: TierId;
  featurePreview: string;
}

const NEXT_TIER_NAMES: Record<string, string> = {
  committed: "Committed",
  dedicated: "Dedicated",
};

export function TierTease({
  currentTier,
  nextTier,
  featurePreview,
}: TierTeaseProps) {
  const nextTierName = NEXT_TIER_NAMES[nextTier] ?? nextTier;
  const highlight = nextTier;

  return (
    <div className="mt-6">
      <div className="relative flex items-center py-4">
        <div className="absolute inset-0 border-t border-[rgba(255,255,255,0.06)]" />
        <span className="relative mx-auto bg-[#0e0e10] px-3 text-[11px] uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          What&apos;s above you
        </span>
      </div>
      <Link
        href={`/pricing?highlight=${highlight}`}
        className="group mt-4 block rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6"
      >
        <div className="relative flex min-h-[80px] items-center justify-center">
          <p
            className="pointer-events-none select-none font-serif text-[15px] leading-[1.8] text-[rgba(240,239,232,0.85)] blur-[4px] transition-[filter] duration-200 group-hover:blur-[2px]"
          >
            {featurePreview}
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <LockIcon className="size-4 text-[rgba(240,239,232,0.4)]" />
            <span
              className="text-xs"
              style={{ color: "rgba(240,239,232,0.4)" }}
            >
              {nextTierName}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
