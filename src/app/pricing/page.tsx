import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { TIERS, PRICING_FAQ } from "@/lib/mock-data";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
            Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[rgba(240,239,232,0.7)]">
            Choose the tier that matches your commitment level.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6"
              >
                <h2 className="text-lg font-medium text-[#f0efe8]">
                  {tier.name}
                </h2>
                <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
                  {tier.description}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-medium text-[#f0efe8]">
                    ${tier.priceMonthly.toFixed(2)}
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
                  ${tier.penaltyPerMiss} penalty per miss
                </p>
                <Link
                  href="/onboarding"
                  className="mt-6 block w-full rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent py-2.5 text-center text-sm font-medium text-[#f0efe8] transition-colors hover:bg-[#131315]"
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-2xl font-semibold text-[#f0efe8]">
              Frequently asked questions
            </h2>
            <div className="mt-12">
              <PricingFAQ faqs={PRICING_FAQ} />
            </div>
          </div>
        </section>

        <footer className="border-t border-[rgba(255,255,255,0.07)] py-8">
          <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-4 text-center text-sm text-[rgba(240,239,232,0.45)]">
            <div className="flex gap-6">
              <Link href="/how-it-works" className="hover:text-[rgba(240,239,232,0.7)]">
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
