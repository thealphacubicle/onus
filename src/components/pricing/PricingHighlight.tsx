"use client";

import { useEffect } from "react";

interface PricingHighlightProps {
  highlight: string | null;
}

export function PricingHighlight({ highlight }: PricingHighlightProps) {
  useEffect(() => {
    if (!highlight) return;
    const id = `tier-${highlight}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-[#c8f060]", "ring-offset-2", "ring-offset-[#0e0e10]");
      const t = setTimeout(() => {
        el.classList.remove("ring-2", "ring-[#c8f060]", "ring-offset-2", "ring-offset-[#0e0e10]");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [highlight]);

  return null;
}
