import { getTiers, getTierPointsConfig } from "@/lib/tiers";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

export default async function OnboardingPage() {
  const [{ tiers, pricingDetails }, tierPointsConfig] = await Promise.all([
    getTiers(),
    getTierPointsConfig(),
  ]);

  const selectablePricingDetails = pricingDetails.filter((d) =>
    ["starter", "committed", "dedicated"].includes(d.id)
  );

  return (
    <OnboardingClient
      tiers={tiers}
      pricingDetails={selectablePricingDetails}
      tierPointsConfig={tierPointsConfig}
    />
  );
}
