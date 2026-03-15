import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { PartnerScrollSection } from "@/components/landing/PartnerScrollSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#f0efe8] sm:text-5xl md:text-6xl">
            <span className="text-[#c8f060]">Show up.</span> Or pay up.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[rgba(240,239,232,0.7)]">
            You know you should go. You just don&apos;t. Onus puts real money on
            the line — so skipping actually costs you, and showing up actually
            pays.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Start your commitment
            </Link>
            <Link
              href="/how-it-works"
              className="inline-block rounded-lg border border-[rgba(255,255,255,0.12)] px-8 py-3.5 text-base font-medium text-[#f0efe8] transition-colors hover:bg-[#131315]"
            >
              How it works
            </Link>
          </div>
        </section>

        {/* Rewards section — partner scroll */}
        <PartnerScrollSection />

        {/* Onus One */}
        <section className="border-t border-[rgba(255,255,255,0.06)] bg-[#0e0e10] py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-[#f0efe8]">
                Onus One
              </h2>
              <p className="mt-1 text-lg text-[rgba(240,239,232,0.7)]">
                For the ones who showed up.
              </p>
              <p className="mt-6 text-[rgba(240,239,232,0.85)]">
                Onus One is not a subscription. It&apos;s a recognition. After
                180 days of consistently meeting your commitment, you earn an
                invitation to join a community of members who did the same.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 h-4 w-1 shrink-0 rounded bg-[#b45309]" />
                  <p className="text-sm text-[rgba(240,239,232,0.8)]">
                    2× OnusPoints · 1,798 pts/mo cap
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-4 w-1 shrink-0 rounded bg-[#b45309]" />
                  <p className="text-sm text-[rgba(240,239,232,0.8)]">
                    5 grace sessions per month — the most generous of any tier
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-4 w-1 shrink-0 rounded bg-[#b45309]" />
                  <p className="text-sm text-[rgba(240,239,232,0.8)]">
                    Daily AI coaching and monthly reviews included
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-4 w-1 shrink-0 rounded bg-[#b45309]" />
                  <p className="text-sm text-[rgba(240,239,232,0.8)]">
                    Community admin access — mentor others if you choose
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 h-4 w-1 shrink-0 rounded bg-[#b45309]" />
                  <p className="text-sm text-[rgba(240,239,232,0.8)]">
                    $8.99/month — the least you&apos;ll ever pay on Onus
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-[10px] border border-[rgba(180,83,9,0.4)] bg-[#1a1a1d] p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[#b45309]">
                  Onus One
                </p>
                <p className="mt-4 font-mono text-4xl font-semibold text-[#c8f060]">
                  180
                </p>
                <p className="text-sm text-[#c8f060]">days</p>
                <p className="mt-4 text-sm text-[rgba(240,239,232,0.8)]">
                  2× OnusPoints · 1,798 pts/mo cap
                </p>
                <p className="mt-4 text-sm italic text-[rgba(240,239,232,0.45)]">
                  Earned. Not purchased.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-[#f0efe8]">
              The only thing standing between you and the habit is follow-through.
            </h2>
            <p className="mt-4 text-[rgba(240,239,232,0.7)]">
              Onus holds you to it.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Start your commitment
            </Link>
            <p className="mt-4 text-sm text-[rgba(240,239,232,0.45)]">
              First month free on Starter. Cancel anytime.
            </p>
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
