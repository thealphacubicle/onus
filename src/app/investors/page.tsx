import Link from "next/link";
import { InvestorKPIDashboard } from "@/components/investors/InvestorKPIDashboard";
import { InvestorFAQ } from "@/components/investors/InvestorFAQ";

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Section 1 — Hero */}
        <section className="pb-10">
          <p className="font-mono text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            ONUS / INVESTOR OVERVIEW
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#f0efe8] sm:text-4xl md:text-5xl">
            The Accountability Platform for a $45B Industry.
          </h1>
          <p className="mt-4 text-[rgba(240,239,232,0.45)]">
            HackHealth 2026 — Full financial model, business case, and Q&A
            below.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="https://onus-kappa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-transparent px-6 py-2.5 text-sm font-medium text-[#f0efe8] transition-colors hover:bg-[#1a1a1d]"
            >
              View live product →
            </Link>
          </div>
          <div className="mt-6 h-px bg-[#c8f060]" />
        </section>

        {/* Section 2 — Key metrics bar */}
        <section className="py-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
              <p className="font-mono text-xl font-medium text-[#c8f060]">
                $21K
              </p>
              <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
                MRR at 1,000 users
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
              <p className="font-mono text-xl font-medium text-[#c8f060]">
                $254K
              </p>
              <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
                ARR at 1,000 users
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
              <p className="font-mono text-xl font-medium text-[#c8f060]">
                $23.47
              </p>
              <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
                Blended ARPU
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
              <p className="font-mono text-xl font-medium text-[#c8f060]">
                90%
              </p>
              <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
                Profit margin
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
              <p className="font-mono text-xl font-medium text-[#c8f060]">
                77M
              </p>
              <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
                US gym members (HFA 2024)
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — KPI Dashboard */}
        <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <h2 className="mb-6 text-2xl font-semibold text-[#f0efe8]">
            Interactive KPI dashboard
          </h2>
          <div className="rounded-xl border border-[rgba(255,255,255,0.09)] bg-[#111113] p-6">
            <InvestorKPIDashboard />
          </div>
        </section>

        {/* Section 4 — Business model narrative */}
        <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                Three revenue streams
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                Subscription fees provide predictable MRR. Penalty revenue
                scales automatically with user behavior — no additional sales
                effort required. Partner commissions unlock a B2B layer as the
                rewards ecosystem grows.
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                Why margins stay high
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                Infrastructure costs are near-fixed. Adding user #1,001 costs
                virtually nothing extra. At 1,000 users, fixed opex is
                $360/month against $23K+ MRR. Stripe fees are the only variable
                cost, and they scale proportionally with revenue.
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                The penalty flywheel
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                Penalty revenue at 1,000 users ($13,882/month) already exceeds
                subscription revenue ($9,590/month). As users scale, penalty
                revenue compounds faster because it&apos;s driven by behavior, not
                just headcount. The 45% rewards pool converts to Onus Points —
                not cash — keeping value locked inside the ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 — Market opportunity */}
        <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <h2 className="mb-6 text-2xl font-semibold text-[#f0efe8]">
            The opportunity
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-6">
                <p className="font-mono text-2xl font-medium text-[#c8f060]">
                  77M
                </p>
                <p className="mt-1 text-sm text-[rgba(240,239,232,0.45)]">
                  US gym members — record high (HFA, 2024)
                </p>
              </div>
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-6">
                <p className="font-mono text-2xl font-medium text-[#c8f060]">
                  67%
                </p>
                <p className="mt-1 text-sm text-[rgba(240,239,232,0.45)]">
                  of memberships go rarely or never used (industry estimate)
                </p>
              </div>
              <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-6">
                <p className="font-mono text-2xl font-medium text-[#c8f060]">
                  51M+
                </p>
                <p className="mt-1 text-sm text-[rgba(240,239,232,0.45)]">
                  people paying for gyms they don&apos;t use — Onus&apos;s
                  addressable market
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#f0efe8]">
                A $45–46B industry with a retention crisis.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                The US fitness industry hit $45–46B in revenue in 2025 (HFA),
                yet one in three members quits every year. The average annual
                retention rate is just 66.4% (HFA 2025 Benchmarking Report).
                Existing solutions — streaks, badges, social sharing — produce
                zero financial consequence for quitting. Onus introduces the
                missing variable: real stakes.
              </p>
              <div className="mt-4 flex flex-wrap gap-6">
                <div>
                  <p className="font-mono text-lg font-medium text-[#c8f060]">
                    50%
                  </p>
                  <p className="text-xs text-[rgba(240,239,232,0.45)]">
                    of new members quit within 6 months (HFA, 2025)
                  </p>
                </div>
                <div>
                  <p className="font-mono text-lg font-medium text-[#c8f060]">
                    66.4%
                  </p>
                  <p className="text-xs text-[rgba(240,239,232,0.45)]">
                    average annual gym retention rate (HFA 2025 Benchmarking
                    Report)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 — Competitive positioning */}
        <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <h2 className="mb-6 text-2xl font-semibold text-[#f0efe8]">
            Why Onus wins
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                Brand-toxic for incumbents
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                WHOOP, Strava, and Planet Fitness cannot penalize their own
                users for missing workouts — the backlash would be immediate.
                Onus owns this positioning because it requires a brand built
                around accountability from day one, not retrofitted onto an
                existing product.
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                DietBet does it. We do it better.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                DietBet and StepBet proved financial accountability works. Onus
                is different: continuous subscription relationship (not episodic
                challenges), gym-specific geolocation verification (not
                weigh-in photos), and a rewards ecosystem that builds long-term
                loyalty. DietBet is a fantasy league. Onus is a gym membership
                with teeth.
              </p>
            </div>
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h3 className="font-medium text-[#f0efe8]">
                The penalty mechanism is a moat
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(240,239,232,0.7)]">
                The legal and reputational risk of a penalty-based model keeps
                large incumbents out. We&apos;ve structured user agreements to
                make consent, terms, and cancellation explicit — analogous to
                DietBet and StepBet, which have operated under similar
                structures for over a decade.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 — FAQ */}
        <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
          <h2 className="text-2xl font-semibold text-[#f0efe8]">
            Common questions
          </h2>
          <p className="mt-2 text-sm text-[rgba(240,239,232,0.45)]">
            The questions we expect — and our answers.
          </p>
          <div className="mt-6">
            <InvestorFAQ />
          </div>
        </section>

        {/* Section 8 — Footer */}
        <footer className="border-t border-[rgba(255,255,255,0.07)] py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm font-medium text-[#f0efe8]">
              Onus — HackHealth 2026
            </span>
            <a
              href="https://onus-kappa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[rgba(240,239,232,0.7)] hover:text-[#f0efe8]"
            >
              onus-kappa.vercel.app
            </a>
            <span className="text-sm italic text-[rgba(240,239,232,0.45)]">
              This page is intended for judges and investors only.
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
