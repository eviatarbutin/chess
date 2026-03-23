# ChessLens — Lichess Analytics & Improvement

A chess analytics platform built with Next.js that pulls data from the [Lichess API](https://lichess.org/api) to give players deep insights into their games, ratings, openings, weaknesses, and more.

## Features

- **Player Dashboard** — Enter any Lichess username to see profile stats, rating cards, win/loss charts, and recent games
- **Rating History** — Interactive line charts tracking Elo across all time controls
- **Opening Analysis** — Sortable table of openings by win rate, games played, and average rating change
- **Game Browser** — Paginated game list with speed and result filters
- **Activity Patterns** — Games by day-of-week and hour-of-day with win rate heatmaps
- **Weakness Detection** — Rule-based analysis that identifies color imbalance, low win rates, bad openings, and tilt patterns
- **Player Comparison** — Head-to-head comparison of two Lichess players
- **Teacher Dashboard** — Manage students, compare their stats, and view their weaknesses in one place (localStorage-backed)
- **Static Pages** — Features, Pricing, About, Blog, Teachers, Privacy, Terms

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
- [Lichess API](https://lichess.org/api) for all chess data

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Install

```bash
git clone <your-repo-url>
cd chess-analyzer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deploy to Netlify

This project is pre-configured for Netlify with the `@netlify/plugin-nextjs` plugin.

### Option 1 — Git-based deploy (recommended)

1. Push this repo to GitHub/GitLab/Bitbucket
2. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site → Import an existing project**
3. Select your repository
4. Netlify will auto-detect the settings from `netlify.toml` — no config needed
5. Click **Deploy site**

### Option 2 — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init        # link to a new or existing site
netlify deploy --build --prod
```

### Environment Variables

No environment variables are required. All data is fetched from the public Lichess API at runtime.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Navbar + Footer)
│   ├── page.tsx                  # Landing page
│   ├── about/                    # About page
│   ├── blog/                     # Blog listing
│   ├── compare/                  # Head-to-head comparison
│   ├── features/                 # Feature showcase
│   ├── pricing/                  # Pricing tiers
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── teachers/                 # Teacher listing + dashboard
│   │   ├── page.tsx              # Teacher list
│   │   └── dashboard/page.tsx    # Teacher dashboard
│   └── analyze/[username]/       # Player analysis (dynamic)
│       ├── layout.tsx            # Shared sidebar layout
│       ├── page.tsx              # Dashboard overview
│       ├── activity/             # Day/time stats
│       ├── games/                # Game browser
│       ├── openings/             # Opening analysis
│       ├── ratings/              # Rating history
│       └── weaknesses/           # Weakness detection
├── components/
│   ├── ui/                       # Button, Card
│   ├── layout/                   # Navbar, Footer
│   ├── landing/                  # Hero, Features, HowItWorks, CTA
│   ├── analyze/                  # All analysis components
│   └── teachers/                 # Teacher dashboard components
├── hooks/
│   └── useStudents.ts            # localStorage-backed student management
└── lib/
    ├── lichess.ts                # Typed Lichess API client
    └── analysis.ts               # Stats, openings, weaknesses, time analysis
```

## Adding Teachers

Edit the `TEACHERS` array in `src/app/teachers/page.tsx`. Each teacher entry has:

```typescript
{
  id: "unique-id",
  name: "FM John Smith",
  title: "FM",              // GM, IM, FM, CM, NM
  rating: 2300,
  ratingType: "FIDE Classical",
  languages: ["English"],
  specialties: ["Tactics", "Endgames"],
  bio: "Short biography...",
  lichessUsername: "johnfm", // optional
  hourlyRate: 40,            // optional
  currency: "USD",           // optional
  available: true,
}
```

## License

MIT
