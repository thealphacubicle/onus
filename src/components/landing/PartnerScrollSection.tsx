"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LANDING_PARTNERS } from "@/lib/mock-data";
import type { PartnerDetails } from "@/lib/mock-data";

function PartnerLogo({
  partner,
  onClick,
}: {
  partner: PartnerDetails;
  onClick: () => void;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex shrink-0 items-center justify-center transition-opacity hover:opacity-80"
      >
        <div className="flex size-[72px] items-center justify-center rounded-xl bg-white px-3 py-2">
          <span className="text-center text-xs font-semibold text-[#0e0e10]">
            {partner.name}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center justify-center rounded-xl transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#c8f060]/50 focus:ring-offset-2 focus:ring-offset-[#0e0e10]"
    >
      <div className="relative flex size-[72px] items-center justify-center rounded-xl bg-white p-4 shadow-sm">
        <Image
          src={`https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`}
          alt={partner.name}
          width={56}
          height={56}
          className="object-contain"
          unoptimized
          onError={() => setError(true)}
        />
      </div>
    </button>
  );
}

export function PartnerScrollSection() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerDetails | null>(
    null
  );

  // Stop body scroll when expander is open
  useEffect(() => {
    if (selectedPartner) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPartner]);

  return (
    <section className="bg-[#0e0e10] py-20">
      <div className="mx-auto max-w-6xl px-10">
        <h2 className="text-[28px] font-medium text-[#f0efe8]">
          Rewards you can actually use
        </h2>
        <p className="mt-2 text-[15px] text-[rgba(240,239,232,0.6)]">
          Consistent members earn rewards redeemable with our partners. Click a
          logo to learn more.
        </p>

        <div className="relative mt-10 overflow-hidden">
          {/* Fade masks */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0e0e10] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0e0e10] to-transparent"
            aria-hidden
          />

          {/* Self-scrolling marquee — pauses when expander is open */}
          <div
            className={`flex animate-marquee items-center gap-14 ${selectedPartner ? "animate-marquee-paused" : ""}`}
          >
            {[...LANDING_PARTNERS, ...LANDING_PARTNERS].map((partner, i) => (
              <PartnerLogo
                key={`${partner.domain}-${i}`}
                partner={partner}
                onClick={() => setSelectedPartner(partner)}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedPartner}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPartner(null);
            // Restore body scroll after dialog close animation (Base UI Dialog also sets overflow: hidden)
            setTimeout(() => {
              document.body.style.overflow = "auto";
            }, 250);
          }
        }}
      >
        <DialogContent className="flex max-h-[85vh] w-[calc(100vw-3rem)] max-w-5xl flex-col border-0 bg-[#1a1a1d] p-0 shadow-2xl sm:w-[calc(100vw-4rem)] [&>button]:top-6 [&>button]:right-6 [&>button]:text-[rgba(240,239,232,0.5)] [&>button]:hover:text-[#f0efe8]">
          {selectedPartner && (
            <div className="min-h-0 flex-1 overflow-y-auto p-10 pr-16 sm:p-14 sm:pr-20">
              <DialogHeader>
                <div className="flex items-start gap-8">
                  <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-white p-5">
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${selectedPartner.domain}&sz=128`}
                      alt={selectedPartner.name}
                      width={64}
                      height={64}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-3xl font-medium text-[#f0efe8]">
                      {selectedPartner.name}
                    </DialogTitle>
                    <span className="mt-1 inline-block text-xs font-medium uppercase tracking-[0.12em] text-[#c8f060]">
                      {selectedPartner.category}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-10 space-y-8">
                <p className="text-[17px] leading-relaxed text-[rgba(240,239,232,0.85)]">
                  {selectedPartner.description}
                </p>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-[rgba(240,239,232,0.5)]">
                    Our partnership
                  </h4>
                  <p className="text-[17px] leading-relaxed text-[rgba(240,239,232,0.85)]">
                    {selectedPartner.partnership}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-[rgba(240,239,232,0.5)]">
                    How rewards work
                  </h4>
                  <p className="text-[17px] leading-relaxed text-[rgba(240,239,232,0.85)]">
                    {selectedPartner.rewards}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
