import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Onus coaching AI. Onus is a financial commitment platform where users commit to gym sessions and are charged for missing them. Your voice is direct, honest, and warm — like a coach who respects the user enough to tell them the truth. Never use generic affirmations. Never say 'great job' or 'keep it up'. Always reference specific data from the user's history. Keep responses under 80 words unless specified otherwise.`;

type FeatureType = "coaching" | "reflection" | "summary" | "nudge";

interface CoachingContext {
  userName: string;
  tier: string;
  goalFrequency: number;
  currentStreak: number;
  sessionsThisWeek: number;
  sessionsGoal: number;
  missesThisMonth: number;
  why: string;
  recentPattern: string;
}

interface ReflectionContext {
  userName: string;
  missedDay: string;
  penaltyAmount: number;
  missesThisMonth: number;
  goalFrequency: number;
  sessionsRemaining: number;
  daysLeftInWeek: number;
}

interface SummaryContext {
  userName: string;
  month: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  missesCount: number;
  penaltiesCharged: number;
  onusPoints: number;
  onusPointsRedemptionValue: string;
  streakAtMonthEnd: number;
  bestWeek: string;
  comparedToPriorMonth: string;
}

interface NudgeContext {
  userName: string;
  currentTier: string;
  nextTier: string;
  weeksConsistent: number;
  graceSessionsUsed: number;
  nextTierPenalty: number;
  nextTierRewardRate: string;
}

type Context =
  | CoachingContext
  | ReflectionContext
  | SummaryContext
  | NudgeContext;

const FALLBACK_MESSAGES: Record<FeatureType, string> = {
  coaching:
    "You're two sessions in this week with one to go. Friday's your chance. Don't let the streak slip.",
  reflection:
    "You missed a session. That's $10. You've got time left this week — get two more in and you're back on track.",
  summary:
    "Solid month. You hit most of your sessions. A few misses cost you, but the streak shows you can do this. Next month: lock in those high-risk days.",
  nudge:
    "You've been consistent for weeks. The next tier would push you harder — and reward you more. Ready when you are.",
};

function buildCoachingPrompt(ctx: CoachingContext): string {
  return `Write a weekly coaching message for ${ctx.userName}.
Tier: ${ctx.tier}. Goal: ${ctx.goalFrequency}x/week.
Current streak: ${ctx.currentStreak} days.
This week: ${ctx.sessionsThisWeek}/${ctx.sessionsGoal} sessions.
Misses this month: ${ctx.missesThisMonth}.
Their why: '${ctx.why}'.
Recent pattern: ${ctx.recentPattern}.
Be direct. Reference their specific numbers.
End with one forward-looking sentence about this week.
Under 75 words.`;
}

function buildReflectionPrompt(ctx: ReflectionContext): string {
  return `Write a missed session reflection for ${ctx.userName}.
They missed ${ctx.missedDay}. Penalty: $${ctx.penaltyAmount}.
Misses this month: ${ctx.missesThisMonth}.
Goal: ${ctx.goalFrequency}x/week.
Sessions remaining to hit goal: ${ctx.sessionsRemaining}
in ${ctx.daysLeftInWeek} days.
Be honest, not harsh. State the facts.
End with one specific, actionable sentence about 
how they recover this week. Under 60 words.`;
}

function buildSummaryPrompt(ctx: SummaryContext): string {
  return `Write a monthly summary for ${ctx.userName} for ${ctx.month}.
Sessions: ${ctx.sessionsCompleted}/${ctx.sessionsTotal}.
Misses: ${ctx.missesCount}. Penalties: $${ctx.penaltiesCharged}.
OnusPoints: ${ctx.onusPoints.toLocaleString()} pts ($${ctx.onusPointsRedemptionValue} redemption value).
Streak at month end: ${ctx.streakAtMonthEnd} days.
Best week: ${ctx.bestWeek}.
vs prior month: ${ctx.comparedToPriorMonth}.
Open with their single most important stat, large.
Write 3 sentences of honest narrative about the month.
End with one sentence about next month.
Under 100 words total.`;
}

function buildNudgePrompt(ctx: NudgeContext): string {
  return `Write a tier upgrade nudge for ${ctx.userName}.
Current tier: ${ctx.currentTier}.
They've been consistent for ${ctx.weeksConsistent} weeks.
Grace sessions used this month: ${ctx.graceSessionsUsed}.
Next tier: ${ctx.nextTier} ($${ctx.nextTierPenalty} penalty,
OnusPoints earn rate ${ctx.nextTierRewardRate}×).
Make them feel the gap between where they are
and what they're capable of.
One observation, one challenge, one invitation.
Under 60 words. Do not use the word 'upgrade'.`;
}

function buildPrompt(feature: FeatureType, context: Context): string {
  switch (feature) {
    case "coaching":
      return buildCoachingPrompt(context as CoachingContext);
    case "reflection":
      return buildReflectionPrompt(context as ReflectionContext);
    case "summary":
      return buildSummaryPrompt(context as SummaryContext);
    case "nudge":
      return buildNudgePrompt(context as NudgeContext);
    default:
      return "";
  }
}

const MAX_TOKENS: Record<FeatureType, number> = {
  coaching: 150,
  reflection: 100,
  summary: 180,
  nudge: 100,
};

const STREAMING_FEATURES: FeatureType[] = ["coaching", "summary"];

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  let body: { feature: FeatureType; context: Context };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { feature, context } = body;
  if (!feature || !context) {
    return NextResponse.json(
      { error: "Missing feature or context" },
      { status: 400 }
    );
  }

  const validFeatures: FeatureType[] = [
    "coaching",
    "reflection",
    "summary",
    "nudge",
  ];
  if (!validFeatures.includes(feature)) {
    return NextResponse.json(
      { error: "Invalid feature type" },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey });
  const userPrompt = buildPrompt(feature, context);
  const maxTokens = MAX_TOKENS[feature];
  const stream = STREAMING_FEATURES.includes(feature);

  try {
    if (stream) {
      const response = anthropic.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of response) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({ text: event.delta.text }) + "\n"
                  )
                );
              }
            }
            controller.enqueue(
              encoder.encode(JSON.stringify({ done: true }) + "\n")
            );
          } catch (err) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  text: FALLBACK_MESSAGES[feature],
                  done: true,
                }) + "\n"
              )
            );
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          "Content-Type": "application/x-ndjson",
          "Cache-Control": "no-store",
        },
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const text =
      (textBlock && "text" in textBlock ? String(textBlock.text).trim() : null) ??
      FALLBACK_MESSAGES[feature];

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { text: FALLBACK_MESSAGES[feature] },
      { status: 200 }
    );
  }
}
