"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "dashboard";
  userName?: string;
  streak?: number;
}

export function Navbar({ variant = "landing", userName, streak = 0 }: NavbarProps) {
  if (variant === "landing") {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[rgba(255,255,255,0.07)] bg-[#0e0e10]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-semibold text-[#f0efe8]">
            Onus
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:text-[#f0efe8]"
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:text-[#f0efe8]"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg bg-[#c8f060] px-4 py-2 text-sm font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-6">
      <div>
        <h1 className="text-lg font-medium text-[#f0efe8]">
          Hey, {userName ?? "there"}
        </h1>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[#1a1a1d] px-3 py-1.5">
          <Flame className="size-4 text-[#f07070]" />
          <span className="font-mono text-sm font-medium text-[#f0efe8]">
            {streak} day streak
          </span>
        </div>
      )}
    </header>
  );
}
