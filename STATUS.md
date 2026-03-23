# ChessLens — Functionality Status

> Last updated: March 23, 2026

## Pages

| Route | Status | Notes |
|---|---|---|
| `/` | Working | Landing page with Hero, Features, HowItWorks, CTA |
| `/features` | Working | Static feature showcase |
| `/about` | Working | Static about page |
| `/pricing` | Working | Static pricing cards with 3 tiers |
| `/privacy` | Working | Static legal text |
| `/terms` | Working | Static legal text |
| `/blog` | Working | Static blog listing with sample posts |
| `/teachers` | Working | Static teacher cards with sample teachers |
| `/compare` | Working | Client-side form, fetches Lichess API on submit |
| `/analyze/[username]` | Working | Server-side — profile, ratings, win/loss charts, recent games |
| `/analyze/[username]/ratings` | Working | Server-side — rating history chart + rating cards |
| `/analyze/[username]/openings` | Working | Server-side — sortable opening table, best/worst highlights |
| `/analyze/[username]/games` | Working | Server-side fetch, client-side filter/pagination |
| `/analyze/[username]/activity` | Working | Games by day-of-week, hour-of-day, win rate by hour |
| `/analyze/[username]/weaknesses` | Working | Weakness detection + suggestions |

## Interactive Elements

| Element | Location | Status | Notes |
|---|---|---|---|
| Username search input | `/` Hero | **Working** | Navigates to `/analyze/{username}` on submit |
| "Start Analyzing" button | `/` CTA | **Broken** | Links to `/analyze` (no username) — would 404 |
| "View All Features" button | `/` CTA | Working | Links to `/features` |
| Navbar links | Global | Working | All point to real pages |
| "Log In" button | Navbar | **No-op** | No auth system — button does nothing |
| "Get Started" button | Navbar | **No-op** | No auth system — button does nothing |
| Mobile hamburger menu | Navbar | Working | Opens/closes, links work |
| Footer links | Global | Working | All point to real pages |
| Compare form | `/compare` | Working | Fetches both users from Lichess, shows side-by-side |
| Analyze sidebar nav | `/analyze/*` | Working | Highlights active page, navigates between tabs |
| Opening table sort | `/analyze/*/openings` | Working | Click column headers to sort |
| Game list filters | `/analyze/*/games` | Working | Speed and result filters, pagination |
| Game links to Lichess | `/analyze/*/games` | Working | External link icons open game on lichess.org |
| "View on Lichess" link | Analyze layout header | Working | External link to player profile |
| Blog "Read" links | `/blog` | **Broken** | Link to `/blog/{slug}` but no blog post pages exist |
| Blog category pills | `/blog` | **No-op** | Render as styled spans but no filtering logic |
| Teacher "Contact" buttons | `/teachers` | **No-op** | No contact/messaging system |
| Teacher "Lichess Profile" links | `/teachers` | Working | External links to lichess.org |
| "Apply as a Teacher" button | `/teachers` | **No-op** | No application form |
| Pricing buttons | `/pricing` | **Partial** | All link back to `/` — no payment/auth system |
| "Want to contribute?" CTA | `/about` | **No-op** | Static text, no contact form |
| Hero stats (10M+ games, 50K+ players) | `/` | **Hardcoded** | Vanity numbers, not real data |

## Data & API

| Feature | Status | Notes |
|---|---|---|
| Lichess user fetch | Working | `getUser()` — profile, ratings, game counts |
| Lichess games fetch | Working | `getUserGames()` — last N games with openings |
| Lichess rating history | Working | `getRatingHistory()` — points for chart |
| Game stats computation | Working | Win/loss/draw by color |
| Opening stats computation | Working | Aggregated by ECO code |
| Time/day stats computation | Working | Buckets by day-of-week and hour |
| Weakness detection | Working | Rule-based (color imbalance, low win rate, bad openings, tilt) |
| Error handling (bad username) | Working | All analyze pages show friendly error if API fails |
| Compare page API calls | Working | Client-side fetch to Lichess |

## Not Yet Implemented

| Feature | Notes |
|---|---|
| Authentication (Login / Sign Up) | No auth system — buttons are placeholders |
| Blog post detail pages (`/blog/[slug]`) | Blog listing exists but individual posts don't |
| Blog category filtering | Category pills render but don't filter |
| Teacher contact / messaging | Buttons are placeholders |
| Teacher application form | CTA exists but no form |
| Payment / subscription system | Pricing page is display-only |
| Loading states for analyze pages | No `loading.tsx` skeletons yet |
