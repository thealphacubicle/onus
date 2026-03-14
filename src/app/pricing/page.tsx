import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  TIERS,
  PRICING_TIER_DETAILS,
  PRICING_PAGE_FAQ,
} from "@/lib/mock-data";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";

export default function PricingPage() {
  const getDetail = (id: string) =>
    PRICING_TIER_DETAILS.find((t) => t.id === id)!;

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
            Pick your level of accountability
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[rgba(240,239,232,0.7)]">
            Be honest about where you are. You can always level up.
          </p>
        </section>

        {/* Pricing cards */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-6 sm:grid-cols-3">
              {TIERS.map((tier) => {
                const detail = getDetail(tier.id);
                const isAccent = detail.ctaVariant === "accent";
                return (
                  <div
                    key={tier.id}
                    className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6"
                  >
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-[#f0efe8]">
                        {tier.name}
                      </h2>
                      <span className="rounded-md bg-[#c8f060]/20 px-2 py-0.5 text-xs font-medium text-[#c8f060]">
                        {detail.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[rgba(240,239,232,0.6)]">
                      {tier.description}
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-medium text-[#f0efe8]">
                        ${tier.priceMonthly.toFixed(2)}
                      </span>
                      <span className="text-sm text-[rgba(240,239,232,0.6)]">
                        /mo
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-sm text-[#f07070]">
                      ${tier.penaltyPerMiss} per missed session
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-[rgba(240,239,232,0.7)]">
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Goal range:
                        </span>{" "}
                        {detail.goalRange}
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Grace sessions:
                        </span>{" "}
                        {detail.graceSessions}
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          AI coaching:
                        </span>{" "}
                        {detail.aiCoaching}
                      </p>
                      <p>
                        <span className="text-[rgba(240,239,232,0.45)]">
                          Reward rate:
                        </span>{" "}
                        {detail.rewardRate}
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className={`mt-6 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-opacity ${
                        isAccent
                          ? "bg-[#c8f060] text-[#0e0e10] hover:opacity-90"
                          : "border border-[rgba(255,255,255,0.12)] bg-transparent text-[#f0efe8] hover:bg-[#131315]"
                      }`}
                    >
                      {detail.ctaText}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-5xl overflow-x-auto px-6">
            <table className="w-full min-w-[500px] border-collapse text-left">
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
                </tr>
              </thead>
              <tbody className="text-sm text-[rgba(240,239,232,0.8)]">
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly price
                  </td>
                  <td className="py-4 px-6 font-mono">$2.99</td>
                  <td className="py-4 px-6 font-mono">$4.99</td>
                  <td className="py-4 px-6 font-mono">$10.99</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Penalty per miss
                  </td>
                  <td className="py-4 px-6 font-mono">$5</td>
                  <td className="py-4 px-6 font-mono">$10</td>
                  <td className="py-4 px-6 font-mono">$20</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Goal range (sessions/week)
                  </td>
                  <td className="py-4 px-6">1–2</td>
                  <td className="py-4 px-6">3–4</td>
                  <td className="py-4 px-6">5–7</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Grace sessions/month
                  </td>
                  <td className="py-4 px-6">4</td>
                  <td className="py-4 px-6">3</td>
                  <td className="py-4 px-6">2</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    AI goal builder
                  </td>
                  <td className="py-4 px-6">Yes</td>
                  <td className="py-4 px-6">Yes</td>
                  <td className="py-4 px-6">Yes</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    AI coaching frequency
                  </td>
                  <td className="py-4 px-6">Goal builder only</td>
                  <td className="py-4 px-6">Weekly check-in</td>
                  <td className="py-4 px-6">Daily coaching + pushback</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Reward earning rate
                  </td>
                  <td className="py-4 px-6 font-mono">0.5×</td>
                  <td className="py-4 px-6 font-mono">1×</td>
                  <td className="py-4 px-6 font-mono">2×</td>
                </tr>
                <tr className="border-b border-[rgba(255,255,255,0.07)]">
                  <td className="py-4 pr-6 text-[rgba(240,239,232,0.45)]">
                    Monthly reward cap
                  </td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
                  <td className="py-4 px-6">—</td>
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
