import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PartnerScrollSection } from "@/components/landing/PartnerScrollSection";
import { TIERS } from "@/lib/mock-data";
import { Target, CheckCircle2, DollarSign } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#f0efe8] sm:text-5xl md:text-6xl">
            Show up. Or pay up.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[rgba(240,239,232,0.7)]">
            Commit to gym sessions. Get financially penalized for missing them.
            Real accountability with real stakes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/how-it-works"
              className="inline-block rounded-lg border border-[rgba(255,255,255,0.12)] px-8 py-3.5 text-base font-medium text-[#f0efe8] transition-colors hover:bg-[#131315]"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="inline-block rounded-lg border border-[rgba(255,255,255,0.12)] px-8 py-3.5 text-base font-medium text-[#f0efe8] transition-colors hover:bg-[#131315]"
            >
              Pricing
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[rgba(240,239,232,0.7)]">
              Real accountability with real stakes. Here&apos;s the simple flow.
            </p>

            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
                  <Target className="size-7 text-[#c8f060]" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-[#f0efe8]">
                  1. Commit
                </h3>
                <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                  Pick your tier and set a SMART goal with our AI. You decide how
                  many sessions per week and the penalty for missing.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
                  <CheckCircle2 className="size-7 text-[#c8f060]" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-[#f0efe8]">
                  2. Verify
                </h3>
                <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                  Check in after each session. Simple, fast, no gym selfies
                  required. We trust you — but the penalty keeps you honest.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
                  <DollarSign className="size-7 text-[#f07070]" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-[#f0efe8]">
                  3. Or pay
                </h3>
                <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                  Miss a session? You get charged. No excuses. Earn rewards when
                  you show up — redeem for gym discounts and gear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rewards section — partner scroll */}
        <PartnerScrollSection />

        {/* Pricing */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
              Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-[rgba(240,239,232,0.7)]">
              Choose the tier that matches your commitment level.
            </p>

            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6"
                >
                  <h3 className="text-lg font-medium text-[#f0efe8]">
                    {tier.name}
                  </h3>
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
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-[#f0efe8]">
              Ready to get serious?
            </h2>
            <p className="mt-4 text-[rgba(240,239,232,0.7)]">
              Join thousands who show up because the stakes are real.
            </p>
            <Link
              href="/onboarding"
              className="mt-8 inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Sign up
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
