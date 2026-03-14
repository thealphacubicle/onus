import type { Tier, User, Commitment, Session, WeekSummary, RedemptionOption, RewardCategory } from "./types";

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 2.99,
    penaltyPerMiss: 5,
    firstMonthFree: true,
    description: "Perfect for getting started. Low commitment, low penalty.",
  },
  {
    id: "committed",
    name: "Committed",
    priceMonthly: 4.99,
    penaltyPerMiss: 10,
    description: "For those ready to get serious. Balanced stakes.",
  },
  {
    id: "dedicated",
    name: "Dedicated",
    priceMonthly: 10.99,
    penaltyPerMiss: 20,
    description: "Maximum accountability. No excuses.",
  },
];

export const MOCK_USER: User = {
  id: "user-1",
  email: "alex@example.com",
  name: "Alex Chen",
};

/** AI-recommended tier based on the user's goal (e.g. "committed" for 3x/week) */
export const MOCK_AI_RECOMMENDED_TIER_ID = "committed";

export const MOCK_COMMITMENT: Commitment = {
  tierId: "committed",
  goal: "Hit the gym 3 times per week — Mon, Wed, Fri mornings before work",
  sessionsPerWeek: 3,
  penaltyPerMiss: 10,
  graceSessionsRemaining: 1,
  graceSessionsTotal: 2,
};

export const MOCK_SMART_GOAL =
  "Hit the gym 3 times per week — Mon, Wed, Fri mornings before work. You'll check in within 2 hours of each session. Miss a session and you'll be charged $10 (after grace sessions).";

export const MOCK_GOAL_BUILDER_MESSAGES = [
  {
    role: "ai" as const,
    text: "Hey! Let's build a goal that actually sticks. First — how many times per week do you want to hit the gym?",
  },
  {
    role: "user" as const,
    text: "3 times — Mon, Wed, Fri ideally.",
  },
  {
    role: "ai" as const,
    text: "Solid. What's your gym history been like? Have you been consistent before, or is this a fresh start?",
  },
  {
    role: "user" as const,
    text: "I've tried a few times but always fall off after a month or two.",
  },
  {
    role: "ai" as const,
    text: "Got it. Last question — why does this matter to you right now? What's the real reason you want to show up?",
  },
  {
    role: "user" as const,
    text: "I want to feel stronger and have more energy. My job is sedentary and I'm tired of feeling sluggish.",
  },
  {
    role: "ai" as const,
    text: MOCK_SMART_GOAL,
  },
];

function getWeekDates(): { date: string; dayName: string; status: Session["status"] }[] {
  const today = new Date();
  const days: { date: string; dayName: string; status: Session["status"] }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = dayNames[d.getDay()];
    let status: Session["status"] = "rest";
    if (i === 0) status = "today";
    else if (i === -3) status = "done";
    else if (i === -1) status = "done";
    else if (i === -2) status = "missed";
    days.push({ date: dateStr, dayName, status });
  }
  return days;
}

export const MOCK_WEEK_DAYS = getWeekDates();

export const MOCK_DASHBOARD_STATS = {
  sessionsThisWeek: 2,
  sessionsGoal: 3,
  penaltiesCharged: 10,
  rewardsEarned: 4.2,
  streak: 3,
};

export const MOCK_COACHING_MESSAGE =
  "You crushed Monday and Wednesday — one more session and you'll hit your goal this week. Friday's the day. Don't let that $10 penalty sneak up on you. You've got this.";

export const MOCK_HISTORY: WeekSummary[] = [
  {
    id: "w1",
    dateRange: "Mar 3 – Mar 9",
    startDate: "2025-03-03",
    endDate: "2025-03-09",
    sessionsCompleted: 3,
    sessionsMissed: 0,
    penaltiesCharged: 0,
  },
  {
    id: "w2",
    dateRange: "Mar 10 – Mar 16",
    startDate: "2025-03-10",
    endDate: "2025-03-16",
    sessionsCompleted: 2,
    sessionsMissed: 1,
    penaltiesCharged: 10,
  },
  {
    id: "w3",
    dateRange: "Feb 24 – Mar 2",
    startDate: "2025-02-24",
    endDate: "2025-03-02",
    sessionsCompleted: 2,
    sessionsMissed: 1,
    penaltiesCharged: 10,
  },
  {
    id: "w4",
    dateRange: "Feb 17 – Feb 23",
    startDate: "2025-02-17",
    endDate: "2025-02-23",
    sessionsCompleted: 3,
    sessionsMissed: 0,
    penaltiesCharged: 0,
  },
  {
    id: "w5",
    dateRange: "Feb 10 – Feb 16",
    startDate: "2025-02-10",
    endDate: "2025-02-16",
    sessionsCompleted: 3,
    sessionsMissed: 0,
    penaltiesCharged: 0,
  },
  {
    id: "w6",
    dateRange: "Feb 3 – Feb 9",
    startDate: "2025-02-03",
    endDate: "2025-02-09",
    sessionsCompleted: 2,
    sessionsMissed: 1,
    penaltiesCharged: 10,
  },
];

export const MOCK_REWARDS_BALANCE = 4.2;

export const MOCK_PENALTY_BALANCE = 20;

export const MOCK_PENALTY_RECOVERABLE = Math.min(
  MOCK_REWARDS_BALANCE,
  MOCK_PENALTY_BALANCE
);

export const REWARD_CATEGORIES: RewardCategory[] = [
  {
    id: "gym",
    label: "Gym membership",
    subtext: "Apply rewards directly to your monthly dues",
    icon: "gym",
    partners: ["Planet Fitness", "Equinox", "Anytime Fitness", "LA Fitness"],
    ctaText: "Check if your gym is supported",
  },
  {
    id: "penalty",
    label: "Penalty refunds",
    subtext: "Recover past penalties with your earned rewards",
    icon: "penalty",
    partners: null,
  },
  {
    id: "supplements",
    label: "Supplements & nutrition",
    subtext: "Shop with our nutrition partners",
    icon: "supplements",
    partners: ["MyProtein", "Thorne", "Athletic Greens (AG1)", "GNC"],
  },
  {
    id: "devices",
    label: "Smart devices",
    subtext: "Put rewards toward wearables and trackers",
    icon: "devices",
    partners: ["Whoop", "Fitbit", "Garmin", "Apple Health partners"],
  },
  {
    id: "gift",
    label: "Gift cards",
    subtext: "Redeem for major retailer gift cards",
    icon: "gift",
    partners: ["Amazon", "Target", "Walmart", "Nike"],
  },
];

export interface PartnerDetails {
  name: string;
  category: string;
  domain: string;
  description: string;
  partnership: string;
  rewards: string;
}

export const LANDING_PARTNERS: PartnerDetails[] = [
  {
    name: "WHOOP",
    category: "DEVICE",
    domain: "whoop.com",
    description: "WHOOP is a wearable fitness tracker that monitors strain, recovery, and sleep.",
    partnership: "We sync with WHOOP to verify your activity. Check in after a workout and your WHOOP data helps confirm your session.",
    rewards: "Earn rewards for consistent check-ins. Redeem for WHOOP accessories or membership credits.",
  },
  {
    name: "Apple Health",
    category: "DEVICE",
    domain: "apple.com",
    description: "Apple Health aggregates your fitness data from iPhone, Apple Watch, and compatible apps.",
    partnership: "We read workout data from Apple Health to verify your gym sessions. One tap to confirm after your workout.",
    rewards: "Consistent members earn rewards redeemable for Apple gift cards and Health-compatible accessories.",
  },
  {
    name: "Spotify",
    category: "MUSIC",
    domain: "spotify.com",
    description: "Spotify brings music and podcasts to your workouts with millions of tracks and playlists.",
    partnership: "Hit your weekly goals and unlock Spotify Premium credits. We partner to reward your consistency.",
    rewards: "Redeem earned rewards for Spotify Premium months — music that keeps you moving.",
  },
  {
    name: "Planet Fitness",
    category: "GYM",
    domain: "planetfitness.com",
    description: "Planet Fitness offers affordable gym access with locations nationwide.",
    partnership: "Apply your Onus rewards directly to your Planet Fitness membership dues each month.",
    rewards: "Earn rewards when you show up. Use them to offset your monthly gym fees at participating locations.",
  },
];

export const PRICING_FAQ = [
  {
    id: "faq-1",
    question: "What happens if I miss a session?",
    answer:
      "You get charged the penalty for your tier. We give you grace sessions when you first start — typically 2 free misses — so you have a buffer. After that, every missed session triggers the penalty.",
  },
  {
    id: "faq-2",
    question: "Can I change my tier or goal?",
    answer:
      "Yes. You can upgrade or downgrade your tier anytime from your profile. Changing your goal (e.g., sessions per week) requires going through the goal builder again to keep your commitment intentional.",
  },
  {
    id: "faq-3",
    question: "How do I check in?",
    answer:
      "Use the Onus app to check-in after each gym session. Fool-proof. Uses geolocation technology to make you accountable.",
  },
  {
    id: "faq-4",
    question: "What can I redeem rewards for?",
    answer:
      "Earned rewards can be redeemed for gym membership discounts, gear credits at partner stores, supplement credits, and recovery sessions like massage or physio.",
  },
  {
    id: "faq-5",
    question: "Is there a contract or commitment period?",
    answer:
      "No long-term contract. You can cancel anytime. Your subscription renews monthly, and you're only charged penalties for sessions you actually miss.",
  },
];

export const MOCK_REDEMPTIONS: RedemptionOption[] = [
  {
    id: "r1",
    name: "Gym Membership Discount",
    description: "$10 off your next month at participating gyms",
    cost: 10,
    type: "discount",
  },
  {
    id: "r2",
    name: "Gear Credits",
    description: "Redeem for workout gear at partner stores",
    cost: 15,
    type: "credit",
  },
  {
    id: "r3",
    name: "Protein Supplement Credit",
    description: "$5 credit at supplement partners",
    cost: 5,
    type: "partner",
  },
  {
    id: "r4",
    name: "Recovery Session",
    description: "One free massage or physio session",
    cost: 25,
    type: "partner",
  },
];
