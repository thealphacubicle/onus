"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TierSelect } from "@/components/onboarding/TierSelect";
import { GoalBuilder } from "@/components/onboarding/GoalBuilder";
import { ContractSummary } from "@/components/onboarding/ContractSummary";
import { MOCK_COMMITMENT, MOCK_AI_RECOMMENDED_TIER_ID, TIERS } from "@/lib/mock-data";
import { createCommitment } from "@/app/actions/create-commitment";
import type { PricingTierDetail } from "@/lib/tiers";
import type { Tier, TierId, TierPointsConfig } from "@/lib/types";

const STEPS = ["Set your goal", "Choose your tier", "Commitment contract"];
const MOCK_WHY =
  "I want to feel stronger and have more energy. My job is sedentary and I'm tired of feeling sluggish.";

interface OnboardingClientProps {
  tiers: Tier[];
  pricingDetails: PricingTierDetail[];
  tierPointsConfig: Record<string, TierPointsConfig>;
}

export function OnboardingClient({ tiers, pricingDetails, tierPointsConfig }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState<TierId | null>(
    MOCK_AI_RECOMMENDED_TIER_ID as TierId
  );
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedTierId) return;
    setConfirmError(null);
    const result = await createCommitment({
      tier: selectedTierId,
      goal_frequency: commitment.sessionsPerWeek,
      goal_description: commitment.goal,
      penalty_amount: commitment.penaltyPerMiss,
      grace_sessions_total: commitment.graceSessionsTotal,
      why: MOCK_WHY,
    });
    if (result?.error === "auth_required") {
      router.push("/login?redirect=/onboarding");
    }
  };

  const commitment = selectedTierId
    ? {
        ...MOCK_COMMITMENT,
        tierId: selectedTierId,
        penaltyPerMiss:
          TIERS[selectedTierId as keyof typeof TIERS]?.penalty ??
          tiers.find((t) => t.id === selectedTierId)?.penaltyPerMiss ??
          MOCK_COMMITMENT.penaltyPerMiss,
        graceSessionsTotal:
          TIERS[selectedTierId as keyof typeof TIERS]?.graceSessions ??
          MOCK_COMMITMENT.graceSessionsTotal,
      }
    : MOCK_COMMITMENT;

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <header className="border-b border-[rgba(255,255,255,0.07)] bg-[#131315]">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="font-semibold text-[#f0efe8]">
            Onus
          </Link>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-8 rounded-full ${
                  i <= step ? "bg-[#c8f060]" : "bg-[rgba(255,255,255,0.1)]"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#f0efe8]">
          {STEPS[step]}
        </h1>

        {step === 0 && (
          <div className="mt-8">
            <GoalBuilder />
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg bg-[#c8f060] px-6 py-2.5 font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8">
            <p className="mb-6 text-[rgba(240,239,232,0.8)]">
              Based on your goal, here&apos;s my recommendation. You can choose
              any plan that fits you.
            </p>
            <TierSelect
              tiers={tiers}
              pricingDetails={pricingDetails}
              tierPointsConfig={tierPointsConfig}
              selectedId={selectedTierId}
              onSelect={(id) => setSelectedTierId(id as TierId)}
              recommendedId={MOCK_AI_RECOMMENDED_TIER_ID}
            />
            <p className="mt-6 text-center text-sm text-[rgba(240,239,232,0.45)]">
              Every plan earns OnusPoints redeemable with our partners. 100 pts
              = $1. First redemption unlocks at 500 pts.
            </p>
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-6 py-2.5 font-medium text-[#f0efe8] transition-colors hover:bg-[#1a1a1d]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedTierId}
                className="rounded-lg bg-[#c8f060] px-6 py-2.5 font-medium text-[#0e0e10] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            {confirmError && (
              <p className="mb-4 text-sm text-[#f07070]">{confirmError}</p>
            )}
            <ContractSummary
              commitment={commitment}
              tiers={tiers}
              tierPointsConfig={tierPointsConfig}
              onConfirm={handleConfirm}
            />
            <div className="mt-6 flex justify-start">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-6 py-2.5 font-medium text-[#f0efe8] transition-colors hover:bg-[#1a1a1d]"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
