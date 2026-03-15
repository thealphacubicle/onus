"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    id: "q1",
    question:
      "Is this legal? Isn't charging people for missing gym sessions gambling?",
    answer:
      "No. Onus is a subscription service where users voluntarily enter a commitment contract with explicitly agreed-upon penalty terms. This is legally analogous to platforms like DietBet and StepBet, which have operated for over a decade. Gambling requires a prize funded by losses of other participants — Onus penalties are revenue to Onus, not a prize pool. Each user sets their own session frequency and penalty amount. Consent, terms, and cancellation are made explicit at onboarding. We've reviewed comparable platform structures and plan formal legal review pre-launch.",
  },
  {
    id: "q2",
    question: "How do you prevent users from faking their location?",
    answer:
      "Geolocation spoofing is a known attack vector with layered mitigations: GPS coordinates must match a registered gym within a configurable radius, check-in timestamps are validated against historical patterns, and our roadmap includes optional WHOOP and Apple Health biometric verification (heart rate elevation concurrent with check-in). Critically, the incentive structure inverts the fraud problem — Onus users sign up because they want accountability. Cheating the system means cheating yourself, which defeats the product's entire value proposition.",
  },
  {
    id: "q3",
    question: "What happens when users dispute a penalty charge?",
    answer:
      "Users sign a digital commitment contract at onboarding that explicitly states penalty terms — not buried in ToS. Stripe's infrastructure handles disputes with documented transaction metadata. Committed and Dedicated tiers include one free miss per billing period, reducing adversarial edge cases. Subscription revenue provides a stable base regardless of penalty disputes.",
  },
  {
    id: "q4",
    question: "What's your moat? Can't Strava or WHOOP just build this?",
    answer:
      "Three reasons they won't. First, adding a financial penalty feature to an existing product would generate massive user backlash — \"you're punishing us\" — for any brand that didn't launch with accountability as its core identity. Second, incumbents face legal review, internal politics, and brand risk that a purpose-built startup doesn't. Third, Onus is building the commitment infrastructure and rewards network — the ecosystem takes time to compound and creates switching costs that a feature can't replicate.",
  },
  {
    id: "q5",
    question: "Walk me through the unit economics.",
    answer:
      "At 1,000 users with our assumed tier mix (50/25/15/10) and miss rates (45% miss 3x, 30% miss 2x, 20% miss 1x, 5% miss 0x): Subscription MRR is $9,590. Penalty revenue (Onus 55% share) adds $13,882. Total gross revenue: $23,472/month. After Stripe fees ($1,890) and fixed opex ($360), net revenue is $21,222/month — a 90% margin. The KPI dashboard above is fully interactive — drag the slider to model any user scale.",
  },
  {
    id: "q6",
    question: "What's your customer acquisition strategy?",
    answer:
      "Early stage: organic and community-led — fitness subreddits, TikTok accountability content, referral loops within gyms (members invite workout partners). Target CAC under $20 through these channels. Scaled: gym chain co-marketing partnerships give warm, high-intent audiences at near-zero CAC. The product is inherently social — \"I'm on Onus, you should join so we keep each other accountable\" is a natural conversation that drives organic growth.",
  },
  {
    id: "q7",
    question: "What's the long-term vision beyond gym check-ins?",
    answer:
      "Phase 1 is gym accountability — prove the model, build the user base, activate the partner ecosystem. Phase 2 is B2B: corporate wellness programs ($50B+ market), gym chain white-label partnerships, and smart check-in hardware for gyms (dedicated devices that remove geolocation ambiguity and create a physical distribution moat). Phase 3 is the behavior change platform — applying the same commitment + penalty + reward mechanic to sleep, nutrition, focus, and other measurable habits. Think Brick (the phone-blocking app), but for every health behavior.",
  },
  {
    id: "q8",
    question:
      "Why should we believe the miss rate assumptions in your model?",
    answer:
      "HFA's 2025 Benchmarking Report shows a 66.4% annual gym retention rate — meaning 1 in 3 members quits each year, implying consistent non-attendance before cancellation. Our miss rate distribution (45/30/20/5) is a conservative estimate based on this data. We've modeled it transparently and the assumptions expander in the dashboard above shows exactly how the math works. We'd rather present defensible conservative assumptions than optimistic projections.",
  },
];

export function InvestorFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.07)]"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center gap-4 bg-[#131315] px-6 py-4 text-left transition-colors hover:bg-[#1a1a1d]"
            >
              <span
                className="size-2 shrink-0 rounded-full bg-[#c8f060]"
                aria-hidden
              />
              <span className="flex-1 font-medium text-[#f0efe8]">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-[rgba(240,239,232,0.6)] transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-out",
                isOpen ? "max-h-[500px]" : "max-h-0"
              )}
            >
              <div className="border-t border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] px-6 py-4 pl-12">
                <p className="text-sm leading-relaxed text-[rgba(240,239,232,0.8)]">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
