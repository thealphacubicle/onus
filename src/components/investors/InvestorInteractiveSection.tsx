"use client";

import { useState, useMemo } from "react";
import { InvestorKPIDashboard } from "./InvestorKPIDashboard";

const TIER_MIX = {
  starter: 0.5,
  committed: 0.25,
  dedicated: 0.15,
  onusOne: 0.1,
} as const;

const AVG_MISSES_PER_USER = 0.45 * 3 + 0.3 * 2 + 0.2 * 1 + 0.05 * 0;
const PENALTY_SPLIT_ONUS = 0.55;
const STRIPE_RATE = 0.029;
const STRIPE_FIXED = 0.3;
const FIXED_OPEX = 360;

const TIER_PRICES = {
  starter: 6.99,
  committed: 9.99,
  dedicated: 17.99,
  onusOne: 8.99,
} as const;

const TIER_PENALTIES = {
  starter: 7,
  committed: 15,
  dedicated: 30,
  onusOne: 0,
} as const;

function computeMetrics(users: number) {
  const starterUsers = users * TIER_MIX.starter;
  const committedUsers = users * TIER_MIX.committed;
  const dedicatedUsers = users * TIER_MIX.dedicated;
  const onusOneUsers = users * TIER_MIX.onusOne;

  const subRevenue =
    starterUsers * TIER_PRICES.starter +
    committedUsers * TIER_PRICES.committed +
    dedicatedUsers * TIER_PRICES.dedicated +
    onusOneUsers * TIER_PRICES.onusOne;

  const grossPenalty =
    starterUsers * AVG_MISSES_PER_USER * TIER_PENALTIES.starter +
    committedUsers * AVG_MISSES_PER_USER * TIER_PENALTIES.committed +
    dedicatedUsers * AVG_MISSES_PER_USER * TIER_PENALTIES.dedicated;

  const onusPenalty = grossPenalty * PENALTY_SPLIT_ONUS;
  const grossRevenue = subRevenue + onusPenalty;

  const penaltyTxns = users * AVG_MISSES_PER_USER;
  const totalTxns = users + penaltyTxns;
  const stripeFees =
    (subRevenue + grossPenalty) * STRIPE_RATE + totalTxns * STRIPE_FIXED;

  const operatingCosts = stripeFees + FIXED_OPEX;
  const netRevenue = grossRevenue - operatingCosts;
  const margin = grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0;

  const mrr = netRevenue;
  const arr = netRevenue * 12;
  const arpu = users > 0 ? grossRevenue / users : 0;

  return { mrr, arr, arpu, margin };
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toFixed(0)}`;
}

export function InvestorInteractiveSection() {
  const [users, setUsers] = useState(1000);
  const metrics = useMemo(() => computeMetrics(users), [users]);

  return (
    <>
      {/* Key metrics bar */}
      <section className="py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
            <p className="font-mono text-xl font-medium text-[#c8f060]">
              {formatCompact(metrics.mrr)}
            </p>
            <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              Net MRR at {users.toLocaleString()} users
            </p>
          </div>
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
            <p className="font-mono text-xl font-medium text-[#c8f060]">
              {formatCompact(metrics.arr)}
            </p>
            <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              Net ARR at {users.toLocaleString()} users
            </p>
          </div>
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
            <p className="font-mono text-xl font-medium text-[#c8f060]">
              ${metrics.arpu.toFixed(2)}
            </p>
            <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              Blended ARPU
            </p>
          </div>
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
            <p className="font-mono text-xl font-medium text-[#c8f060]">
              {metrics.margin.toFixed(0)}%
            </p>
            <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              Profit margin
            </p>
          </div>
          <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
            <p className="font-mono text-xl font-medium text-[#c8f060]">
              77M
            </p>
            <p className="mt-0.5 text-xs text-[rgba(240,239,232,0.45)]">
              US gym members (HFA 2024)
            </p>
          </div>
        </div>
      </section>

      {/* KPI Dashboard */}
      <section className="border-t border-[rgba(255,255,255,0.07)] py-10">
        <h2 className="mb-6 text-2xl font-semibold text-[#f0efe8]">
          Interactive KPI dashboard
        </h2>
        <div className="rounded-xl border border-[rgba(255,255,255,0.09)] bg-[#111113] p-6">
          <InvestorKPIDashboard users={users} onUsersChange={setUsers} />
        </div>
      </section>
    </>
  );
}
