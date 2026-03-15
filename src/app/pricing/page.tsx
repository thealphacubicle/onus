import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PRICING_PAGE_FAQ, TIERS } from "@/lib/mock-data";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingHighlight } from "@/components/pricing/PricingHighlight";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SELECTABLE_TIERS = ["starter", "committed", "dedicated"] as const;

const AI_COACHING_LABELS: Record<string, string> = {
  goal_builder_only: "Goal builder only",
  weekly: "Weekly coaching",
  daily: "Daily coaching",
  daily_plus_insights: "Daily + insights + habit stacking",
};

const BADGES: Record<string, { text: string; variant: "green" | "blue" | "amber" }> = {
  starter: { text: "First month free", variant: "green" },
  committed: { text: "Most popular", variant: "blue" },
  dedicated: { text: "Highest stakes", variant: "amber" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ highlight?: string }>;
}) {
  const params = await searchParams;
  const highlight = params.highlight ?? null;

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <PricingHighlight highlight={highlight} />
      <Navbar variant="landing" />

      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
            Pick your level of accountability
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[rgba(240,239,232,0.7)]">
            Be honest about where you are. You can always level up.
          </p>
        </section>

        {/* Pricing cards — 2×2 grid */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {SELECTABLE_TIERS.map((id) => {
                const tier = TIERS[id];
                const badge = BADGES[id];
                const badgeClass =
                  badge.variant === "green"
                    ? "bg-[#c8f060]/20 text-[#c8f060]"
                    : badge.variant === "blue"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-amber-500/20 text-amber-400";
                return (
                  <Link
                    key={id}
                    href="/login"
                    id={`tier-${id}`}
                    className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 transition-shadow duration-300 hover:border-[rgba(255,255,255,0.12)]"
                  >
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-[#f0efe8]">
                        {tier.name}
                      </h2>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-medium text-[#f0efe8]">
                        ${tier.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-[rgba(240,239,232,0.6)]">
                        /mo
                      </span>
                      {tier.firstMonthFree && (
                        <span className="ml-2 text-xs text-[#c8f060]">
                          First month free
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-sm text-[#f07070]">
                      ${tier.penalty} per missed session
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-[rgba(240,239,232,0.7)]">
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Points:
                        </span>{" "}
                        {tier.pointsRate}× earn rate, up to{" "}
                        {tier.pointsCapPerMonth.toLocaleString()} pts/mo ($
                        {tier.pointsCapDollarValue.toFixed(2)})
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Grace:
                        </span>{" "}
                        {tier.graceSessions} sessions/month
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          AI:
                        </span>{" "}
                        {AI_COACHING_LABELS[tier.aiCoaching] ?? tier.aiCoaching}
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Monthly review:
                        </span>{" "}
                        {tier.monthlyReview ? "Yes" : "—"}
                      </p>
                    </div>
                    <span
                      className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-opacity ${
                        badge.variant === "green"
                          ? "bg-[#c8f060] text-[#0e0e10] hover:opacity-90"
                          : "border border-[rgba(255,255,255,0.12)] bg-transparent text-[#f0efe8] hover:bg-[#131315]"
                      }`}
                    >
                      {id === "starter" ? "Try free" : "Get started"}
                    </span>
                  </Link>
                );
              })}
              {/* Onus One card — not selectable */}
              <div className="rounded-[10px] border border-[#c8f060]/60 bg-[#1a1a1d] p-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-[#f0efe8]">
                    Onus One
                  </h2>
                  <span className="rounded-md bg-[#c8f060]/20 px-2 py-0.5 text-xs font-medium text-[#c8f060]">
                    Earned, not bought
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-medium text-[#f0efe8]">
                    $8.99
                  </span>
                  <span className="text-sm text-[rgba(240,239,232,0.6)]">
                    /mo
                  </span>
                </div>
                <p className="mt-1 text-xs text-[rgba(240,239,232,0.45)]">
                  Earned after 180 days
                </p>
                <div className="mt-4 space-y-2 text-sm text-[rgba(240,239,232,0.7)]">
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Grace sessions:
                    </span>{" "}
                    <span className="font-medium text-[#c8f060]">
                      5/month
                    </span>
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Earn rate:
                    </span>{" "}
                    <span className="font-medium text-[#c8f060]">
                      2× OnusPoints
                    </span>
                  </p>
                  <p className="text-[11px] italic text-[rgba(240,239,232,0.45)]">
                    Pool-funded
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Monthly cap:
                    </span>{" "}
                    1,798 pts ($17.98 value)
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      AI coaching:
                    </span>{" "}
                    Daily + insights + habit stacking
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Monthly review:
                    </span>{" "}
                    Yes
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Community access:
                    </span>{" "}
                    Admin — optional mentor
                  </p>
                  <p>
                    <span className="text-[rgba(240,239,232,0.45)]">
                      Demotion trigger:
                    </span>{" "}
                    5 missed goals
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger
                    aria-disabled="true"
                    tabIndex={-1}
                    className="mt-6 block w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent py-2.5 text-center text-sm font-medium text-[rgba(240,239,232,0.5)] cursor-not-allowed"
                  >
                    Available after 180 days
                  </TooltipTrigger>
                  <TooltipContent>
                    Keep showing up. This finds you.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-5xl overflow-x-auto px-4 sm:px-6">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <th className="py-4 pr-6 text-sm font-medium text-[rgba(240,239,232,0.45)]">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-[#f0efe8]">
                    Starter
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-[#f0efe8]">
                    Committed
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-[#f0efe8]">
                    Dedicated
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-[#b45309]">
                    Onus One
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-[rgba(240,239,232,0.8)]">
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly price
                  </td>
                  <td className="py-4 px-6 font-mono">$6.99</td>
                  <td className="py-4 px-6 font-mono">$9.99</td>
                  <td className="py-4 px-6 font-mono">$17.99</td>
                  <td className="py-4 px-6 font-mono">$8.99</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Penalty per miss
                  </td>
                  <td className="py-4 px-6 font-mono">$7</td>
                  <td className="py-4 px-6 font-mono">$15</td>
                  <td className="py-4 px-6 font-mono">$30</td>
                  <td className="py-4 px-6">None — status accountability only</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Points earn rate
                  </td>
                  <td className="py-4 px-6 font-mono">0.5×</td>
                  <td className="py-4 px-6 font-mono">1×</td>
                  <td className="py-4 px-6 font-mono">1.25×</td>
                  <td className="py-4 px-6 font-mono">2×</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly points cap
                  </td>
                  <td className="py-4 px-6">350</td>
                  <td className="py-4 px-6">999</td>
                  <td className="py-4 px-6">2,249</td>
                  <td className="py-4 px-6">1,798</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly cap value
                  </td>
                  <td className="py-4 px-6 font-mono">$3.50</td>
                  <td className="py-4 px-6 font-mono">$9.99</td>
                  <td className="py-4 px-6 font-mono">$22.49</td>
                  <td className="py-4 px-6 font-mono">$17.98</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Grace sessions
                  </td>
                  <td className="py-4 px-6">4</td>
                  <td className="py-4 px-6">3</td>
                  <td className="py-4 px-6">2</td>
                  <td className="py-4 px-6">5</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    AI coaching frequency
                  </td>
                  <td className="py-4 px-6">Goal builder only</td>
                  <td className="py-4 px-6">Weekly</td>
                  <td className="py-4 px-6">Daily</td>
                  <td className="py-4 px-6">Daily + insights</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly review
                  </td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">Yes</td>
                  <td className="py-4 px-6">Yes</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Habit stacking
                  </td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">Yes</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Community access
                  </td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">Yes</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    How to qualify
                  </td>
                  <td className="py-4 px-6">Yes — after 180 days</td>
                  <td className="py-4 px-6">Yes — after 180 days</td>
                  <td className="py-4 px-6">Yes — after 180 days</td>
                  <td className="py-4 px-6">Invitation only — 180 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-2xl font-semibold text-[#f0efe8]">
              Common questions
            </h2>
            <div className="mt-12">
              <PricingFAQ faqs={PRICING_PAGE_FAQ} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-[#f0efe8]">
              Still thinking about it?
            </h2>
            <p className="mt-4 text-[rgba(240,239,232,0.7)]">
              That&apos;s kind of the whole problem.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Make the commitment
            </Link>
          </div>
        </section>

        <footer className="border-t border-[rgba(255,255,255,0.07)] py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-[rgba(240,239,232,0.45)]">
            <div className="flex gap-6">
              <Link
                href="/how-it-works"
                className="hover:text-[rgba(240,239,232,0.7)]"
              >
                How it Works
              </Link>
              <Link href="/pricing" className="hover:text-[rgba(240,239,232,0.7)]">
                Pricing
              </Link>
            </div>
            <span>Onus — Fitness accountability with teeth</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
