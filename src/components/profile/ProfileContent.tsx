"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TIERS } from "@/lib/mock-data";
import type { Commitment } from "@/lib/types";

interface ProfileContentProps {
  fullName: string;
  email: string;
  commitment: Commitment;
  streak: number;
}

export function ProfileContent({
  fullName,
  email,
  commitment,
  streak,
}: ProfileContentProps) {
  const tier = TIERS.find((t) => t.id === commitment.tierId);
  const firstName = fullName?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-screen bg-[#0e0e10]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar
          variant="dashboard"
          userName={firstName}
          streak={streak}
        />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-[#f0efe8]">Profile</h1>
          <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
            Your account details
          </p>

          <div className="mt-8 space-y-6">
            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f0efe8]">Account</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Name:</span>{" "}
                  {fullName || "—"}
                </p>
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Email:</span>{" "}
                  {email || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
              <h2 className="font-medium text-[#f0efe8]">Current plan</h2>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-[rgba(240,239,232,0.8)]">
                  <span className="text-[rgba(240,239,232,0.45)]">Tier:</span>{" "}
                  {tier?.name ?? "—"}
                </p>
                <p className="font-mono text-sm text-[#f0efe8]">
                  <span className="text-[rgba(240,239,232,0.45)]">Price:</span>{" "}
                  {tier ? `$${tier.priceMonthly.toFixed(2)}/mo` : "—"}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
