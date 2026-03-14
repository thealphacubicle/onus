import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { BehavioralScienceViz } from "@/components/science/BehavioralScienceViz";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
            How Onus works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[rgba(240,239,232,0.7)]">
            Three steps between you and the habit you keep putting off.
          </p>
        </section>

        {/* Steps — vertical timeline with connecting line on desktop */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="relative">
              {/* Connecting line — visible on desktop */}
              <div
                className="absolute left-[27px] top-14 bottom-14 hidden w-px bg-[rgba(255,255,255,0.07)] sm:block"
                aria-hidden
              />

              <div className="space-y-12">
                <div className="relative flex gap-6">
                  <div className="flex shrink-0">
                    <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] font-mono text-lg font-medium text-[#c8f060]">
                      1
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h2 className="text-xl font-medium text-[#f0efe8]">
                      Make your commitment
                    </h2>
                    <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                      Our AI asks the real questions — your schedule, your
                      history, your why. Then it builds a SMART goal you&apos;ll
                      actually stick to. You sign the contract. The stakes are
                      set.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-6">
                  <div className="flex shrink-0">
                    <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] font-mono text-lg font-medium text-[#c8f060]">
                      2
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h2 className="text-xl font-medium text-[#f0efe8]">
                      Show up
                    </h2>
                    <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                      Check in after each session. Geolocation confirms you were
                      actually there. No manual logging. No honor system. Just
                      proof.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-6">
                  <div className="flex shrink-0">
                    <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] font-mono text-lg font-medium text-[#f07070]">
                      3
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <h2 className="text-xl font-medium text-[#f0efe8]">
                      Miss it? You pay.
                    </h2>
                    <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                      A penalty hits your card automatically. No grace, no
                      renegotiating — unless you&apos;ve earned a grace session.
                      Stick to your commitment and rewards accumulate toward
                      your membership, gear, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The science behind it */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-semibold text-[#f0efe8]">
              The science behind it
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-[rgba(240,239,232,0.7)]">
              Onus is built on two of the most validated principles in behavioral
              economics.
            </p>
            <BehavioralScienceViz />
          </div>
        </section>

        {/* Accountability breakdown */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#131315] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-2xl font-semibold text-[#f0efe8]">
              Why financial stakes work
            </h2>
            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 text-center">
                <p className="font-mono text-3xl font-medium text-[#c8f060]">
                  2×
                </p>
                <p className="mt-2 text-sm font-medium text-[#f0efe8]">
                  Loss aversion
                </p>
                <p className="mt-3 text-sm text-[rgba(240,239,232,0.7)]">
                  People are twice as motivated to avoid losing money than they
                  are to gain a reward. Onus uses that.
                </p>
              </div>
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 text-center">
                <p className="font-mono text-3xl font-medium text-[#c8f060]">
                  95%
                </p>
                <p className="mt-2 text-sm font-medium text-[#f0efe8]">
                  Accountability effect
                </p>
                <p className="mt-3 text-sm text-[rgba(240,239,232,0.7)]">
                  Studies show you&apos;re 95% more likely to achieve a goal
                  when you have a specific accountability commitment in place.
                </p>
              </div>
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6 text-center">
                <p className="font-mono text-3xl font-medium text-[#c8f060]">
                  $0
                </p>
                <p className="mt-2 text-sm font-medium text-[#f0efe8]">
                  Cost if you show up
                </p>
                <p className="mt-3 text-sm text-[rgba(240,239,232,0.7)]">
                  Penalties only hit when you miss. Show up consistently and
                  Onus literally pays for itself through rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[rgba(255,255,255,0.07)] bg-[#0e0e10] py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-semibold text-[#f0efe8]">
              Ready to make the commitment?
            </h2>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
              <Link
                href="/pricing"
                className="inline-block rounded-lg border border-[rgba(255,255,255,0.12)] px-8 py-3.5 text-base font-medium text-[#f0efe8] transition-colors hover:bg-[#131315]"
              >
                See pricing
              </Link>
            </div>
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
