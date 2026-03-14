# Onus

A fitness accountability platform where users commit to gym sessions and get financially penalized for missing them. Clean, dark, premium UI.

## Prerequisites

- Node.js 20+

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Add your keys to `.env.local` when integrating Supabase and Anthropic (optional for now — everything is mocked).

## Commands

- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npx tsc --noEmit` — Type check

## Dev Container

Open the project in a Dev Container (VS Code/Cursor) for a pre-configured Node 20 environment. The `.devcontainer` config runs `npm install` on first create.

## Pages

- `/` — Landing page
- `/onboarding` — 3-step onboarding (tier, goal builder, contract)
- `/dashboard` — Main dashboard with stats, week view, coaching
- `/history` — Past weeks and penalties
- `/rewards` — Earned rewards and redemptions
