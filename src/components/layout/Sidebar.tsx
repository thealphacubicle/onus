"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-[rgba(255,255,255,0.07)] bg-[#131315]">
      <div className="flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] px-6">
        <Link href="/" className="font-semibold text-[#f0efe8]">
          Onus
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
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
    </aside>
  );
}
