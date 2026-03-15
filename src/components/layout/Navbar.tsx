"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavbarProps {
  variant?: "landing" | "dashboard";
  userName?: string;
  streak?: number;
  onMenuClick?: () => void;
}

export function Navbar({ variant = "landing", userName, streak = 0, onMenuClick }: NavbarProps) {
  const [landingNavOpen, setLandingNavOpen] = useState(false);

  if (variant === "landing") {
    return (
      <>
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-[rgba(255,255,255,0.07)] bg-[#0e0e10]/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="font-semibold text-[#f0efe8]">
              Onus
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/how-it-works"
                className="text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:text-[#f0efe8]"
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:text-[#f0efe8]"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:text-[#f0efe8]"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-[#c8f060] px-4 py-2 text-sm font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </nav>
            <button
              type="button"
              onClick={() => setLandingNavOpen(true)}
              className="flex size-10 items-center justify-center rounded-lg text-[#f0efe8] hover:bg-[#1a1a1d] md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </header>
        <Sheet open={landingNavOpen} onOpenChange={setLandingNavOpen}>
          <SheetContent
            side="right"
            className="bg-[#131315] border-[rgba(255,255,255,0.07)] [&_[data-slot=sheet-close]]:text-[#f0efe8] [&_[data-slot=sheet-close]]:hover:bg-[#1a1a1d]"
          >
            <SheetHeader>
              <SheetTitle className="text-[#f0efe8]">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              <Link
                href="/how-it-works"
                onClick={() => setLandingNavOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:bg-[#1a1a1d] hover:text-[#f0efe8]"
              >
                How it works
              </Link>
              <Link
                href="/pricing"
                onClick={() => setLandingNavOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:bg-[#1a1a1d] hover:text-[#f0efe8]"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                onClick={() => setLandingNavOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-sm text-[rgba(240,239,232,0.8)] transition-colors hover:bg-[#1a1a1d] hover:text-[#f0efe8]"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setLandingNavOpen(false)}
                className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#c8f060] px-4 py-3 text-sm font-medium text-[#0e0e10] transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <header className="flex h-14 min-h-[44px] shrink-0 items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.07)] px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#f0efe8] hover:bg-[#1a1a1d] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-medium text-[#f0efe8] sm:text-lg">
            Hey {userName ?? "there"}!
          </h1>
        </div>
      </div>
      {streak > 0 && (
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[#1a1a1d] px-3 py-1.5">
          <Flame className="size-4 text-[#f07070]" />
          <span className="font-mono text-sm font-medium text-[#f0efe8]">
            {streak} day streak
          </span>
        </div>
      )}
    </header>
  );
}
