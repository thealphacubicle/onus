import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Target, CheckCircle2, DollarSign } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <Navbar variant="landing" />

      <main className="pt-16">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl">
            How it works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[rgba(240,239,232,0.7)]">
            Real accountability with real stakes. Here&apos;s the simple flow.
          </p>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#1a1a1d] border border-[rgba(255,255,255,0.07)]">
                <Target className="size-7 text-[#c8f060]" />
              </div>
              <h2 className="mt-6 text-xl font-medium text-[#f0efe8]">
                1. Commit
              </h2>
              <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                Pick your tier and set a SMART goal with our AI. You decide how
                many sessions per week and the penalty for missing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#1a1a1d] border border-[rgba(255,255,255,0.07)]">
                <CheckCircle2 className="size-7 text-[#c8f060]" />
              </div>
              <h2 className="mt-6 text-xl font-medium text-[#f0efe8]">
                2. Verify
              </h2>
              <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                Use the app to check-in after each session. Fool-proof. Uses
                geolocation technology to make you accountable.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#1a1a1d] border border-[rgba(255,255,255,0.07)]">
                <DollarSign className="size-7 text-[#f07070]" />
              </div>
              <h2 className="mt-6 text-xl font-medium text-[#f0efe8]">
                3. Or pay
              </h2>
              <p className="mt-3 text-[rgba(240,239,232,0.7)]">
                Miss a session? You get charged. No excuses. Earn rewards when
                you show up — redeem for gym discounts and gear.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/login"
              className="inline-block rounded-lg bg-[#c8f060] px-8 py-3.5 text-base font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
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
