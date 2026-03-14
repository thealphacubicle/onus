"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface PricingFAQProps {
  faqs: FAQItem[];
}

export function PricingFAQ({ faqs }: PricingFAQProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#131315]"
            >
              <span className="font-medium text-[#f0efe8]">{faq.question}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-[rgba(240,239,232,0.6)] transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t border-[rgba(255,255,255,0.07)] px-6 py-4">
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
