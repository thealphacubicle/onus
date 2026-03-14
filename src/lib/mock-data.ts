export const TIERS = {
  starter: {
    name: "Starter",
    price: 6.99,
    firstMonthFree: true,
    penalty: 7,
    pointsRate: 0.5,
    pointsCapPerMonth: 350,
    pointsCapDollarValue: 3.5,
    graceSessions: 4,
    aiCoaching: "goal_builder_only",
    weeklyCheckin: false,
    monthlyReview: false,
    dailyCoaching: false,
    communityAccess: false,
    onusOneEligible: true,
  },
  committed: {
    name: "Committed",
    price: 9.99,
    firstMonthFree: false,
    penalty: 15,
    pointsRate: 1.0,
    pointsCapPerMonth: 999,
    pointsCapDollarValue: 9.99,
    graceSessions: 3,
    aiCoaching: "weekly",
    weeklyCheckin: true,
    monthlyReview: false,
    dailyCoaching: false,
    communityAccess: false,
    onusOneEligible: true,
  },
  dedicated: {
    name: "Dedicated",
    price: 17.99,
    firstMonthFree: false,
    penalty: 30,
    pointsRate: 1.25,
    pointsCapPerMonth: 2249,
    pointsCapDollarValue: 22.49,
    graceSessions: 2,
    aiCoaching: "daily",
    weeklyCheckin: true,
    monthlyReview: true,
    dailyCoaching: true,
    communityAccess: false,
    onusOneEligible: true,
  },
  onus_one: {
    name: "Onus One",
    price: 8.99,
    firstMonthFree: false,
    penalty: 0,
    pointsRate: 2.0,
    pointsCapPerMonth: 1798,
    pointsCapDollarValue: 17.98,
    graceSessions: 5,
    aiCoaching: "daily_plus_insights",
    weeklyCheckin: true,
    monthlyReview: true,
    dailyCoaching: true,
    habitStacking: true,
    communityAccess: true,
    communityRole: "admin_optional",
    onusOneEligible: false,
    earnedOnly: true,
    qualificationDays: 180,
    demotionTrigger: 5,
    poolFunded: true,
  },
} as const;

export const ONUS_POINTS = {
  pointsPerDollar: 100,
  dollarPerPoint: 0.01,
  minimumRedemption: 500,
  minimumRedemptionValue: 5.0,
  expiryMonths: 12,
  penaltyComebackMultiplier: 2,
  penaltyPoolSplit: 0.45,
  profitSplit: 0.55,
} as const;

export const MOCK_USER = {
  name: "Alex",
  tier: "committed",
  streak: 14,
  onusPoints: 1240,
  onusPointsCap: 999,
  onusPointsRedemptionValue: 12.4,
  sessionsThisWeek: 2,
  sessionsGoal: 3,
  missesThisMonth: 1,
  penaltiesThisMonth: 15.0,
  graceSessRemaining: 2,
  why: "I want to get my energy back after months of sitting at a desk",
  commitmentScore: 78,
  memberSince: "2025-09-14",
} as const;

export const MOCK_HISTORY = [
  { week: "Mar 3–9", completed: 3, goal: 3, missed: 0, penalty: 0 },
  { week: "Feb 24–Mar 2", completed: 2, goal: 3, missed: 1, penalty: 15 },
  { week: "Feb 17–23", completed: 3, goal: 3, missed: 0, penalty: 0 },
  { week: "Feb 10–16", completed: 1, goal: 3, missed: 2, penalty: 30 },
  { week: "Feb 3–9", completed: 3, goal: 3, missed: 0, penalty: 0 },
  { week: "Jan 27–Feb 2", completed: 3, goal: 3, missed: 0, penalty: 0 },
] as const;

export const MOCK_COACHING_MESSAGE = `You've hit 2 of 3 this week — solid. 
Last time you slipped it was also a Thursday. You said your why was 
getting your energy back after months of sitting at a desk. 
That reason hasn't changed. Go tonight.`;

/** AI-recommended tier based on the user's goal (e.g. "committed" for 3x/week) */
export const MOCK_AI_RECOMMENDED_TIER_ID = "committed";

export const MOCK_SMART_GOAL =
  "Hit the gym 3 times per week — Mon, Wed, Fri mornings before work. You'll check in within 2 hours of each session. Miss a session and you'll be charged $15 (after grace sessions).";

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
    name: "Planet Fitness",
    category: "GYM",
    domain: "planetfitness.com",
    description: "Planet Fitness offers affordable gym access with locations nationwide.",
    partnership: "Apply your Onus rewards directly to your Planet Fitness membership dues each month.",
    rewards: "Earn rewards when you show up. Use them to offset your monthly gym fees at participating locations.",
  },
  {
    name: "Equinox",
    category: "GYM",
    domain: "equinox.com",
    description: "Equinox offers premium fitness clubs with world-class facilities and programming.",
    partnership: "Apply your Onus rewards toward Equinox membership and class packages.",
    rewards: "Earn rewards when you show up. Redeem for membership credits at participating locations.",
  },
  {
    name: "Anytime Fitness",
    category: "GYM",
    domain: "anytimefitness.com",
    description: "Anytime Fitness provides 24/7 gym access at thousands of locations worldwide.",
    partnership: "Apply your Onus rewards to your Anytime Fitness membership each month.",
    rewards: "Earn rewards when you show up. Use them to offset your monthly dues.",
  },
  {
    name: "MyProtein",
    category: "NUTRITION",
    domain: "myprotein.com",
    description: "MyProtein offers protein powders, supplements, and nutrition products.",
    partnership: "Redeem Onus rewards for MyProtein credit to fuel your gains.",
    rewards: "Earn rewards when you show up. Shop protein and supplements at a discount.",
  },
  {
    name: "Thorne",
    category: "NUTRITION",
    domain: "thorne.com",
    description: "Thorne provides science-backed supplements and wellness products.",
    partnership: "Redeem Onus rewards for Thorne credit on supplements and vitamins.",
    rewards: "Earn rewards when you show up. Invest in your recovery and performance.",
  },
  {
    name: "AG1",
    category: "NUTRITION",
    domain: "drinkag1.com",
    description: "AG1 is a daily nutritional supplement with vitamins, minerals, and superfoods.",
    partnership: "Redeem Onus rewards for AG1 subscriptions and one-time purchases.",
    rewards: "Earn rewards when you show up. Fuel your body with daily nutrition.",
  },
  {
    name: "GNC",
    category: "NUTRITION",
    domain: "gnc.com",
    description: "GNC offers supplements, vitamins, and sports nutrition products.",
    partnership: "Redeem Onus rewards for GNC credit on supplements and gear.",
    rewards: "Earn rewards when you show up. Shop supplements at participating stores.",
  },
  {
    name: "Whoop",
    category: "DEVICE",
    domain: "whoop.com",
    description: "WHOOP is a wearable fitness tracker that monitors strain, recovery, and sleep.",
    partnership: "We sync with WHOOP to verify your activity. Check in after a workout and your WHOOP data helps confirm your session.",
    rewards: "Earn rewards for consistent check-ins. Redeem for WHOOP accessories or membership credits.",
  },
  {
    name: "Fitbit",
    category: "DEVICE",
    domain: "fitbit.com",
    description: "Fitbit offers fitness trackers and smartwatches to monitor your activity.",
    partnership: "Connect Fitbit to verify workouts. Check in and your data helps confirm your session.",
    rewards: "Earn rewards when you show up. Redeem for Fitbit devices and accessories.",
  },
  {
    name: "Garmin",
    category: "DEVICE",
    domain: "garmin.com",
    description: "Garmin makes GPS watches and fitness trackers for athletes.",
    partnership: "Connect Garmin to verify workouts. Your activity data helps confirm your session.",
    rewards: "Earn rewards when you show up. Redeem for Garmin devices and accessories.",
  },
  {
    name: "Amazon",
    category: "GIFT CARD",
    domain: "amazon.com",
    description: "Amazon offers millions of products for fitness, gear, and everyday needs.",
    partnership: "Redeem Onus rewards for Amazon gift cards. Spend on whatever you need.",
    rewards: "Earn rewards when you show up. Get Amazon credit to use anywhere.",
  },
  {
    name: "Target",
    category: "GIFT CARD",
    domain: "target.com",
    description: "Target offers fitness gear, apparel, and everyday essentials.",
    partnership: "Redeem Onus rewards for Target gift cards. Shop gear and more.",
    rewards: "Earn rewards when you show up. Get Target credit for your next haul.",
  },
  {
    name: "Nike",
    category: "GEAR",
    domain: "nike.com",
    description: "Nike offers athletic footwear, apparel, and equipment for every sport.",
    partnership: "Redeem Onus rewards for Nike credit. Gear up for your next workout.",
    rewards: "Earn rewards when you show up. Get Nike credit for shoes and apparel.",
  },
];

export const PRICING_PAGE_FAQ = [
  {
    id: "faq-1",
    question: "What happens if I have a legitimate emergency?",
    answer:
      "That's what grace sessions are for. Each tier comes with a set number per month that reset automatically. Beyond that, the commitment stands.",
  },
  {
    id: "faq-2",
    question: "How does check-in verification work?",
    answer:
      "Onus uses geolocation to confirm you were physically at your gym. You can't check in from your couch.",
  },
  {
    id: "faq-3",
    question: "Where does my penalty money go?",
    answer:
      "A portion funds the rewards pool for consistent members. The rest covers platform costs. Nobody profits from your failure — we'd rather you show up.",
  },
  {
    id: "faq-4",
    question: "Can I change my tier?",
    answer:
      "Yes, at the end of each monthly cycle. You can upgrade or downgrade based on how the previous month went.",
  },
  {
    id: "faq-5",
    question: "What if my gym isn't supported for OnusPoints?",
    answer:
      "You can still redeem OnusPoints for supplements, smart devices, and gift cards regardless of which gym you attend.",
  },
  {
    id: "faq-6",
    question: "What is Onus One?",
    answer:
      "Onus One is an invitation-only membership for users who have maintained consistent attendance for 180 days. It comes with a reduced subscription, elevated OnusPoints, and access to a community of members who've built the same habit. You can't buy it — you earn it.",
  },
  {
    id: "faq-7",
    question: "What happens if I fall off as an Onus One member?",
    answer:
      "Your habit tracking continues as an Onus One member. If you miss 5 goals, your status is paused and you'll be asked to choose a standard tier again. Once you've rebuilt 60 days of consistent attendance, you can apply to reinstate your Onus One status.",
  },
  {
    id: "faq-8",
    question: "How do OnusPoints work?",
    answer:
      "Every session you complete earns OnusPoints based on your tier. 100 points = $1 in redemption value. You need at least 500 points to make your first redemption. Points are capped each month at your subscription value so the system stays fair. Unused points expire after 12 months of inactivity. Miss a session? Show up next time for 2× points — the comeback bonus.",
  },
  {
    id: "faq-9",
    question: "What can I redeem OnusPoints for?",
    answer:
      "OnusPoints can be redeemed with our partner network — gym membership credits, supplements (MyProtein, Thorne, AG1), smart devices (Whoop, Fitbit, Garmin), and gift cards (Amazon, Target, Nike, Walmart). Minimum redemption is 500 points ($5.00 value).",
  },
];

export const PRICING_FAQ = [
  {
    id: "faq-1",
    question: "What happens if I miss a session?",
    answer:
      "You get charged the penalty for your tier. We give you grace sessions when you first start — typically 2–4 free misses per month depending on tier — so you have a buffer. After that, every missed session triggers the penalty.",
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
    question: "What can I redeem OnusPoints for?",
    answer:
      "OnusPoints can be redeemed with our partner network — gym membership credits, supplements (MyProtein, Thorne, AG1), smart devices (Whoop, Fitbit, Garmin), and gift cards (Amazon, Target, Nike, Walmart). Minimum redemption is 500 points ($5.00 value).",
  },
  {
    id: "faq-5",
    question: "Is there a contract or commitment period?",
    answer:
      "No long-term contract. You can cancel anytime. Your subscription renews monthly, and you're only charged penalties for sessions you actually miss.",
  },
];

export type RewardCategoryIcon = "gym" | "penalty" | "supplements" | "devices" | "gift";

export interface RewardCategory {
  id: string;
  label: string;
  subtext: string;
  icon: RewardCategoryIcon;
  partners: string[] | null;
  ctaText?: string;
  minPts?: number;
  minPtsDollarValue?: number;
}

export const REWARD_CATEGORIES: RewardCategory[] = [
  {
    id: "gym",
    label: "Gym membership",
    subtext: "Apply OnusPoints directly to your monthly dues",
    icon: "gym",
    partners: ["Planet Fitness", "Equinox", "Anytime Fitness", "LA Fitness"],
    ctaText: "Check if your gym is supported",
    minPts: 500,
    minPtsDollarValue: 5,
  },
  {
    id: "penalty",
    label: "Penalty refunds",
    subtext: "Recover past penalties with your earned OnusPoints",
    icon: "penalty",
    partners: null,
    minPts: 500,
    minPtsDollarValue: 5,
  },
  {
    id: "supplements",
    label: "Supplements & nutrition",
    subtext: "Shop with our nutrition partners",
    icon: "supplements",
    partners: ["MyProtein", "Thorne", "Athletic Greens (AG1)", "GNC"],
    minPts: 500,
    minPtsDollarValue: 5,
  },
  {
    id: "devices",
    label: "Smart devices",
    subtext: "Put OnusPoints toward wearables and trackers",
    icon: "devices",
    partners: ["Whoop", "Fitbit", "Garmin", "Apple Health partners"],
    minPts: 500,
    minPtsDollarValue: 5,
  },
  {
    id: "gift",
    label: "Gift cards",
    subtext: "Redeem for major retailer gift cards",
    icon: "gift",
    partners: ["Amazon", "Target", "Walmart", "Nike"],
    minPts: 500,
    minPtsDollarValue: 5,
  },
];

export interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  costInPoints?: number;
  type: "discount" | "credit" | "partner";
}

export const MOCK_REDEMPTIONS: RedemptionOption[] = [
  {
    id: "r1",
    name: "Gym Membership Discount",
    description: "$10 off your next month at participating gyms",
    cost: 10,
    costInPoints: 1000,
    type: "discount",
  },
  {
    id: "r2",
    name: "Gear Credits",
    description: "Redeem for workout gear at partner stores",
    cost: 15,
    costInPoints: 1500,
    type: "credit",
  },
  {
    id: "r3",
    name: "Protein Supplement Credit",
    description: "$5 credit at supplement partners",
    cost: 5,
    costInPoints: 500,
    type: "partner",
  },
  {
    id: "r4",
    name: "Recovery Session",
    description: "One free massage or physio session",
    cost: 25,
    costInPoints: 2500,
    type: "partner",
  },
];

/** Alias for rewards page */
export const MOCK_ONUS_POINTS = MOCK_USER.onusPoints;

/** Derived: points to next 500pt milestone */
export const MOCK_POINTS_TO_NEXT_REDEMPTION = Math.max(
  0,
  MOCK_USER.onusPoints >= 500 ? 500 - (MOCK_USER.onusPoints % 500) : 500 - MOCK_USER.onusPoints
);

/** Derived: commitment for onboarding (Committed tier) */
export const MOCK_COMMITMENT = {
  tierId: "committed" as const,
  goal: "Hit the gym 3 times per week — Mon, Wed, Fri mornings before work",
  sessionsPerWeek: 3,
  penaltyPerMiss: TIERS.committed.penalty,
  graceSessionsRemaining: MOCK_USER.graceSessRemaining,
  graceSessionsTotal: TIERS.committed.graceSessions,
};

/** Derived: dashboard stats fallback */
export const MOCK_DASHBOARD_STATS = {
  sessionsThisWeek: MOCK_USER.sessionsThisWeek,
  sessionsGoal: MOCK_USER.sessionsGoal,
  penaltiesCharged: MOCK_USER.penaltiesThisMonth,
  onusPoints: MOCK_USER.onusPoints,
  onusPointsCap: MOCK_USER.onusPointsCap,
  onusPointsEarnedThisMonth: 420,
  streak: MOCK_USER.streak,
};

/** Derived: penalty balance for rewards (penalties this month) */
export const MOCK_PENALTY_BALANCE = MOCK_USER.penaltiesThisMonth;

/** Derived: recoverable via OnusPoints */
export const MOCK_PENALTY_RECOVERABLE = Math.min(
  MOCK_USER.onusPointsRedemptionValue,
  MOCK_PENALTY_BALANCE
);
