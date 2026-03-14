import { getSelectableTiers } from "@/lib/tiers";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

export default async function OnboardingPage() {
  const tiers = await getSelectableTiers();

  return <OnboardingClient tiers={tiers} />;
}
