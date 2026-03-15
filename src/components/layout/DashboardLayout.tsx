"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { dashboardNavItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  userName?: string;
  streak?: number;
  children: React.ReactNode;
}

export function DashboardLayout({
  userName,
  streak = 0,
  children,
}: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-56 border-r border-[rgba(255,255,255,0.07)] bg-[#131315] p-0 sm:max-w-[224px] [&_[data-slot=sheet-close]]:text-[#f0efe8] [&_[data-slot=sheet-close]]:hover:bg-[#1a1a1d]"
          showCloseButton={true}
        >
          <SheetHeader className="flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] px-6">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Link
              href="/"
              className="font-semibold text-[#f0efe8]"
              onClick={() => setMobileNavOpen(false)}
            >
              Onus
            </Link>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {dashboardNavItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-[#1a1a1d] text-[#c8f060]"
                      : "text-[rgba(240,239,232,0.7)] hover:bg-[#1a1a1d] hover:text-[#f0efe8]"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          variant="dashboard"
          userName={userName}
          streak={streak}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
