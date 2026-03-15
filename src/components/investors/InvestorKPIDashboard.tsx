"use client";

import { useState, useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const margin =
    grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0;

  const mrr = subRevenue;
  const arr = subRevenue * 12;
  const arpu = users > 0 ? grossRevenue / users : 0;

  return {
    subRevenue,
    grossPenalty,
    onusPenalty,
    grossRevenue,
    stripeFees,
    operatingCosts,
    netRevenue,
    margin,
    mrr,
    arr,
    arpu,
    starterUsers,
    committedUsers,
    dedicatedUsers,
    onusOneUsers,
  };
}

const CHART_COLORS = {
  subscriptions: "#c8f060",
  penalty: "#7f77dd",
  operatingCosts: "#f07070",
};

const TIER_COLORS = {
  starter: "#c8f060",
  committed: "#7f77dd",
  dedicated: "#f07070",
  onusOne: "#b45309",
} as const;

export function InvestorKPIDashboard() {
  const [users, setUsers] = useState(1000);
  const [isAnnual, setIsAnnual] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

  const metrics = useMemo(() => computeMetrics(users), [users]);
  const multiplier = isAnnual ? 12 : 1;

  const barData = {
    labels: ["Subscriptions", "Penalty revenue", "Operating costs"],
    datasets: [
      {
        data: [
          metrics.subRevenue * multiplier,
          metrics.onusPenalty * multiplier,
          -metrics.operatingCosts * multiplier,
        ],
        backgroundColor: [
          CHART_COLORS.subscriptions,
          CHART_COLORS.penalty,
          CHART_COLORS.operatingCosts,
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1a1d",
        titleColor: "#f0efe8",
        bodyColor: "rgba(240,239,232,0.8)",
        callbacks: {
          label: (ctx: { raw: unknown }) =>
            `$${Number(ctx.raw).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(240,239,232,0.35)" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "rgba(240,239,232,0.35)" },
      },
    },
  };

  const totalRevenueForDoughnut =
    metrics.subRevenue + metrics.onusPenalty;
  const subPct =
    totalRevenueForDoughnut > 0
      ? (metrics.subRevenue / totalRevenueForDoughnut) * 100
      : 0;
  const penaltyPct =
    totalRevenueForDoughnut > 0
      ? (metrics.onusPenalty / totalRevenueForDoughnut) * 100
      : 0;

  const doughnutData = {
    labels: ["Subscriptions", "Penalty revenue"],
    datasets: [
      {
        data: [metrics.subRevenue, metrics.onusPenalty],
        backgroundColor: [CHART_COLORS.subscriptions, CHART_COLORS.penalty],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1a1d",
        titleColor: "#f0efe8",
        bodyColor: "rgba(240,239,232,0.8)",
      },
    },
  };

  const formatCurrency = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-8">
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#0e0e10] p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="shrink-0">
            <label className="block text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
              User scale
            </label>
            <p className="mt-1 font-mono text-2xl font-medium text-[#c8f060]">
              {users.toLocaleString()} users
            </p>
          </div>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(255,255,255,0.08)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c8f060]"
          />
          <div className="flex shrink-0 rounded-full border border-[rgba(255,255,255,0.12)] bg-[#131315] p-1">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !isAnnual
                  ? "bg-[#c8f060] text-[#0e0e10]"
                  : "text-[rgba(240,239,232,0.7)] hover:text-[#f0efe8]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isAnnual
                  ? "bg-[#c8f060] text-[#0e0e10]"
                  : "text-[rgba(240,239,232,0.7)] hover:text-[#f0efe8]"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Gross Revenue
          </p>
          <p className="mt-1 font-mono text-2xl font-medium text-[#c8f060]">
            {formatCurrency(metrics.grossRevenue * multiplier)}
          </p>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Operating Costs
          </p>
          <p className="mt-1 font-mono text-2xl font-medium text-[#f07070]">
            -{formatCurrency(metrics.operatingCosts * multiplier)}
          </p>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
            Net Revenue
          </p>
          <p className="mt-1 font-mono text-2xl font-medium text-[#f0efe8]">
            {formatCurrency(metrics.netRevenue * multiplier)}
          </p>
          <p className="mt-0.5 text-sm text-[rgba(240,239,232,0.45)]">
            {metrics.margin.toFixed(1)}% margin
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <h3 className="mb-4 text-sm font-medium text-[#f0efe8]">
            Revenue breakdown
          </h3>
          <div className="relative h-[200px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
          <h3 className="mb-4 text-sm font-medium text-[#f0efe8]">
            Revenue mix
          </h3>
          <div className="relative h-[160px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <span className="flex items-center gap-2 text-sm text-[rgba(240,239,232,0.7)]">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: CHART_COLORS.subscriptions }}
              />
              Subscriptions {subPct.toFixed(0)}%
            </span>
            <span className="flex items-center gap-2 text-sm text-[rgba(240,239,232,0.7)]">
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: CHART_COLORS.penalty }}
              />
              Penalty {penaltyPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-6">
        <h3 className="mb-4 text-sm font-medium text-[#f0efe8]">
          Tier distribution
        </h3>
        <div className="space-y-4">
          {(
            [
              { key: "starter", label: "Starter", pct: 50, color: TIER_COLORS.starter, users: metrics.starterUsers },
              { key: "committed", label: "Committed", pct: 25, color: TIER_COLORS.committed, users: metrics.committedUsers },
              { key: "dedicated", label: "Dedicated", pct: 15, color: TIER_COLORS.dedicated, users: metrics.dedicatedUsers },
              { key: "onusOne", label: "Onus One", pct: 10, color: TIER_COLORS.onusOne, users: metrics.onusOneUsers },
            ] as const
          ).map(({ key, label, pct, color, users: u }) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-24 shrink-0 text-sm text-[rgba(240,239,232,0.45)]">
                {label}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-sm text-[rgba(240,239,232,0.7)]">
                {pct}%
              </span>
              <span className="w-20 shrink-0 text-right font-mono text-sm text-[#c8f060]">
                {Math.round(u).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
          <p className="text-xs text-[rgba(240,239,232,0.45)]">MRR</p>
          <p className="font-mono text-lg font-medium text-[#c8f060]">
            {formatCurrency(metrics.mrr)}
          </p>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
          <p className="text-xs text-[rgba(240,239,232,0.45)]">ARR</p>
          <p className="font-mono text-lg font-medium text-[#c8f060]">
            {formatCurrency(metrics.arr)}
          </p>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
          <p className="text-xs text-[rgba(240,239,232,0.45)]">Blended ARPU</p>
          <p className="font-mono text-lg font-medium text-[#c8f060]">
            ${metrics.arpu.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#131315] p-4">
          <p className="text-xs text-[rgba(240,239,232,0.45)]">Profit Margin</p>
          <p className="font-mono text-lg font-medium text-[#c8f060]">
            {metrics.margin.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d]">
        <button
          type="button"
          onClick={() => setAssumptionsOpen(!assumptionsOpen)}
          className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#131315]"
        >
          <span className="text-sm font-medium text-[#f0efe8]">
            Model assumptions & cost breakdown
          </span>
          <svg
            className={`size-5 text-[rgba(240,239,232,0.6)] transition-transform ${
              assumptionsOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {assumptionsOpen && (
          <div className="border-t border-[rgba(255,255,255,0.07)] px-6 py-4">
            <div className="grid gap-8 text-xs sm:grid-cols-3">
              <div>
                <p className="mb-2 font-mono font-medium text-[rgba(240,239,232,0.45)]">
                  Pricing tiers + user mix
                </p>
                <div className="space-y-1 font-mono text-[rgba(240,239,232,0.8)]">
                  <p>Starter $6.99/mo · $7/miss · 50%</p>
                  <p>Committed $9.99/mo · $15/miss · 25%</p>
                  <p>Dedicated $17.99/mo · $30/miss · 15%</p>
                  <p className="text-[#b45309]">Onus One $8.99/mo · $0 · 10%</p>
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono font-medium text-[rgba(240,239,232,0.45)]">
                  Miss rate + penalty split
                </p>
                <div className="space-y-1 font-mono text-[rgba(240,239,232,0.8)]">
                  <p>45% miss 3x/mo · 30% miss 2x · 20% miss 1x · 5% miss 0x</p>
                  <p className="text-[#c8f060]">Onus keeps 55%</p>
                  <p className="text-[rgba(240,239,232,0.45)]">
                    45% → Onus Points pool
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono font-medium text-[rgba(240,239,232,0.45)]">
                  Opex + Stripe
                </p>
                <div className="space-y-1 font-mono text-[rgba(240,239,232,0.8)]">
                  <p className="text-[#f07070]">Fixed: $360/mo</p>
                  <p>Supabase $35 · Vercel $20 · Anthropic $5 · misc $300</p>
                  <p>Stripe: 2.9% + $0.30/txn</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
