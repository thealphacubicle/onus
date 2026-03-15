import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InsightsContent } from "@/components/dashboard/InsightsContent";
import { MonthlySummary } from "@/components/dashboard/MonthlySummary";
import { getInsightsData } from "@/lib/insights-data";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/insights");
  }

  const {
    userName,
    streak,
    tierId,
    tierName,
    coachingMessage,
    coachingGeneratedDate,
    monthlySummaryContext,
    weeksConsistent,
    graceSessionsUsed,
    nextTier,
    nextTierPenalty,
    nextTierRewardRate,
  } = await getInsightsData(user.id);

  const isDedicated = (tierId ?? "").toString().toLowerCase() === "dedicated";

  return (
    <DashboardLayout userName={userName} streak={streak}>
      {monthlySummaryContext && isDedicated && (
        <MonthlySummary
          month={monthlySummaryContext.month}
          nextMonth={monthlySummaryContext.nextMonth}
          sessionsCompleted={monthlySummaryContext.sessionsCompleted}
          sessionsTotal={monthlySummaryContext.sessionsTotal}
          userName={userName}
          missesCount={monthlySummaryContext.missesCount}
          penaltiesCharged={monthlySummaryContext.penaltiesCharged}
          onusPoints={monthlySummaryContext.onusPoints}
          onusPointsRedemptionValue={monthlySummaryContext.onusPointsRedemptionValue}
          streakAtMonthEnd={monthlySummaryContext.streakAtMonthEnd}
          bestWeek={monthlySummaryContext.bestWeek}
          comparedToPriorMonth={monthlySummaryContext.comparedToPriorMonth}
          isFirstMonth={monthlySummaryContext.isFirstMonth}
        />
      )}
      <h1 className="text-2xl font-semibold text-[#f0efe8]">Insights</h1>
      <p className="mt-1 text-sm text-[rgba(240,239,232,0.6)]">
        AI-powered coaching and reviews based on your tier
      </p>
      <div className="mt-8">
        <InsightsContent
          tierId={tierId}
          tierName={tierName}
          coachingMessage={coachingMessage}
          coachingGeneratedDate={coachingGeneratedDate}
          monthlySummaryContext={monthlySummaryContext}
          weeksConsistent={weeksConsistent}
          graceSessionsUsed={graceSessionsUsed}
          nextTier={nextTier}
          nextTierPenalty={nextTierPenalty}
          nextTierRewardRate={nextTierRewardRate}
          userName={userName}
        />
      </div>
    </DashboardLayout>
  );
}
