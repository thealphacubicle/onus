"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "@/lib/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-full w-56 flex-col shrink-0 border-r border-[rgba(255,255,255,0.07)] bg-[#131315]">
      <div className="flex h-14 items-center border-b border-[rgba(255,255,255,0.07)] px-6">
        <Link href="/" className="font-semibold text-[#f0efe8]">
          Onus
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {dashboardNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  );
}
