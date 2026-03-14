"use client";

interface StatsRowProps {
  sessionsThisWeek: number;
  sessionsGoal: number;
  penaltiesCharged: number;
  rewardsEarned: number;
}

export function StatsRow({
  sessionsThisWeek,
  sessionsGoal,
  penaltiesCharged,
  rewardsEarned,
}: StatsRowProps) {
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
          Penalties charged
        </p>
        <p className="mt-1 font-mono text-2xl font-medium text-[#f07070]">
          ${penaltiesCharged}
        </p>
      </div>
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#1a1a1d] p-4">
        <p className="text-xs uppercase tracking-wider text-[rgba(240,239,232,0.45)]">
          Rewards earned
        </p>
        <p className="mt-1 font-mono text-2xl font-medium text-[#c8f060]">
          ${rewardsEarned.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
