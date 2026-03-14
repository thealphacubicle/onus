"use client";

import Link from "next/link";
import type { TierId } from "@/lib/types";

const TIER_NAMES: Record<string, string> = {
  committed: "Committed",
  dedicated: "Dedicated",
};

interface InsightLockedCardProps {
  featureName: string;
  requiredTier: TierId;
  teaserText: string;
  previewSnippet: string;
}

export function InsightLockedCard({
  featureName,
  requiredTier,
  teaserText,
  previewSnippet,
}: InsightLockedCardProps) {
  const tierName = TIER_NAMES[requiredTier] ?? requiredTier;

  return (
    <div className="space-y-4">
      <Link
        href={`/pricing?highlight=${requiredTier}`}
        className="group block"
      >
        <div className="relative flex rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="relative flex min-h-[80px] w-full flex-col items-center justify-center">
            <p
              className="pointer-events-none select-none font-serif text-[15px] leading-[1.8] text-[rgba(240,239,232,0.85)] blur-[4px] transition-[filter] duration-200 group-hover:blur-[2px]"
            >
              {previewSnippet}
            </p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <LockIcon className="size-5 text-[rgba(240,239,232,0.4)]" />
            <span
              className="text-sm font-medium"
              style={{ color: "rgba(240,239,232,0.4)" }}
            >
              {featureName}
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(240,239,232,0.35)" }}
            >
              {tierName} and above
            </span>
            </div>
          </div>
        </div>
      </Link>
      <p
        className="font-serif text-sm italic"
        style={{ color: "rgba(240,239,232,0.45)" }}
      >
        {teaserText}
      </p>
      <Link
        href={`/pricing?highlight=${requiredTier}`}
        className="inline-flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-4 py-2 text-sm font-medium text-[rgba(240,239,232,0.8)] transition-colors hover:bg-[#1a1a1d] hover:text-[#f0efe8]"
      >
        Upgrade to {tierName}
      </Link>
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
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
