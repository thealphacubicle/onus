import { getSelectableTiers, getTierPointsConfig } from "@/lib/tiers";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

export default async function OnboardingPage() {
  const [tiers, tierPointsConfig] = await Promise.all([
    getSelectableTiers(),
    getTierPointsConfig(),
  ]);

  return (
    <OnboardingClient tiers={tiers} tierPointsConfig={tierPointsConfig} />
  );
}
