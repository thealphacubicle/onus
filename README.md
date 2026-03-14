<div align="center">

<span style="font-size: 72px; font-weight: 700; color: #c8f060;">Onus</span>

# Show up. Or pay up.

**Real money on the line. Real accountability. Real results.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## What is Onus?

Onus is a fitness accountability platform that puts **real financial stakes** behind your gym commitment. You know you should go. You just don't. We fix that.

- **Commit** — Set a SMART goal with AI. Sign the contract. The stakes are set.
- **Show up** — Check in after each session. Geolocation confirms you were there.
- **Or pay** — Miss a session? A penalty hits your card. Show up? Rewards accumulate.

No honor system. No excuses. Just proof.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Goal Builder** | Smart goal creation based on your schedule, history, and motivation |
| **Geolocation Check-in** | Verify you were actually at the gym — no manual logging |
| **Tiered Penalties** | Starter ($5), Committed ($10), Dedicated ($20) per miss |
| **Grace Sessions** | Buffer for emergencies — resets monthly by tier |
| **Rewards Program** | Earn credits toward gym memberships, supplements, gear, gift cards |
| **Partner Ecosystem** | Planet Fitness, Equinox, MyProtein, Whoop, Garmin, Nike, and more |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Database & Auth | Supabase |
| AI | Anthropic Claude (mocked) |
| Animations | Framer Motion |

---

## Quick Start

### Prerequisites

- **Node.js** 20 or later

### Installation

```bash
# Clone and install
git clone https://github.com/your-org/onus.git
cd onus
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

Add your keys to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | For account deletion | Service role key |
| `ANTHROPIC_API_KEY` | Optional | AI goal builder (mocked by default) |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/                    # Routes
│   ├── page.tsx            # Landing
│   ├── login/              # Auth
│   ├── how-it-works/       # Product explainer
│   ├── pricing/            # Tier comparison
│   ├── onboarding/         # 3-step signup flow
│   ├── dashboard/          # Main app
│   ├── history/            # Past weeks & penalties
│   ├── rewards/            # Earned rewards
│   └── profile/            # Account & payment methods
├── components/
│   ├── ui/                 # shadcn components
│   ├── layout/             # Navbar, Sidebar
│   ├── landing/            # PartnerScrollSection
│   ├── onboarding/         # TierSelect, GoalBuilder, ContractSummary
│   └── dashboard/          # StatsRow, WeekView, CoachingCard
└── lib/
    ├── mock-data.ts        # Mock data
    ├── types.ts            # TypeScript interfaces
    └── supabase/           # Client, server, admin
```

---

## Design System

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0e0e10` | Primary |
| Surface | `#131315` | Cards, elevated |
| Card | `#1a1a1d` | Content blocks |
| Accent | `#c8f060` | CTAs, highlights |
| Danger | `#f07070` | Penalties, missed |
| Text | `#f0efe8` | Primary |
| Muted | `rgba(240,239,232,0.45)` | Secondary |

---

## Dev Container

Open in VS Code or Cursor with Dev Containers for a pre-configured Node 20 environment. The `.devcontainer` config runs `npm install` on first create.

---

<div align="center">

**Onus — Fitness accountability with teeth.**

</div>
