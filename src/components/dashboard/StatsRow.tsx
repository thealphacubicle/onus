"use client";

interface StatsRowProps {
  sessionsThisWeek: number;
  sessionsGoal: number;
  penaltiesCharged: number;
  onusPoints: number;
}

export function StatsRow({
  sessionsThisWeek,
  sessionsGoal,
  penaltiesCharged,
  onusPoints,
}: StatsRowProps) {
  const redemptionValue = (onusPoints / 100).toFixed(2);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-4">
        <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Sessions this week
        </p>
        <p className="mt-1 font-mono text-2xl font-medium text-[#f0efe8]">
          {sessionsThisWeek}/{sessionsGoal}
        </p>
      </div>
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-4">
        <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Penalties this month
        </p>
        <p className="mt-1 font-mono text-2xl font-medium text-[#f07070]">
          ${penaltiesCharged.toFixed(2)}
        </p>
      </div>
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-4">
        <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          OnusPoints
        </p>
        <p className="mt-1 font-mono text-2xl font-medium text-[#c8f060]">
          {onusPoints.toLocaleString()} pts
        </p>
        <p className="mt-0.5 text-[11px] text-[rgba(240,239,232,0.45)]">
          ${redemptionValue} redemption value
        </p>
      </div>
    </div>
  );
}
