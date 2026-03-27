import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  BookOpen,
  Target,
  Clock,
  Zap,
  Users,
  Shield,
  Brain,
  ArrowRight,
  Puzzle,
  Swords,
} from "lucide-react";

const FEATURE_GROUPS = [
  {
    title: "Analytics",
    description: "Deep insights into your chess performance",
    features: [
      {
        icon: TrendingUp,
        title: "Rating Trends",
        description:
          "Interactive rating charts across bullet, blitz, rapid, and classical. Track your Elo progression over weeks, months, and years with detailed breakdowns.",
      },
      {
        icon: BarChart3,
        title: "Game Statistics",
        description:
          "Comprehensive win/loss/draw ratios by time control, color, and time period. Streak analysis, performance consistency, and peak rating tracking.",
      },
      {
        icon: Clock,
        title: "Time Management",
        description:
          "Analyze your clock usage patterns. Identify if you spend too long in the opening, blunder under time pressure, or play too fast in critical moments.",
      },
    ],
  },
  {
    title: "Strategy",
    description: "Understand your playing style and repertoire",
    features: [
      {
        icon: BookOpen,
        title: "Opening Repertoire",
        description:
          "Complete breakdown of your opening choices with win rates, average rating changes, and performance by ECO code. Find which openings work for you.",
      },
      {
        icon: Swords,
        title: "Opponent Analysis",
        description:
          "Study how you perform against different rating ranges, playing styles, and opening choices. Identify your nemesis patterns.",
      },
      {
        icon: Puzzle,
        title: "Tactical Patterns",
        description:
          "Discover which tactical motifs you handle well (forks, pins, skewers) and which ones consistently trip you up.",
      },
    ],
  },
  {
    title: "Improvement",
    description: "Actionable steps to climb the rating ladder",
    features: [
      {
        icon: Target,
        title: "Weakness Detection",
        description:
          "AI-powered analysis finds recurring mistakes in your endgames, tactics, and time management. Severity-ranked for priority.",
      },
      {
        icon: Zap,
        title: "Personalized Training Plan",
        description:
          "Get a custom roadmap based on your weaknesses. Puzzle recommendations, study material, and practice exercises tailored to your level.",
      },
      {
        icon: Brain,
        title: "Pattern Recognition",
        description:
          "Identify positions and structures where you consistently make mistakes. Build awareness of your blind spots.",
      },
    ],
  },
  {
    title: "Social",
    description: "Compare and compete with others",
    features: [
      {
        icon: Users,
        title: "Head-to-Head Comparison",
        description:
          "Compare your stats with any Lichess player. Side-by-side rating charts, opening overlap analysis, and performance comparison.",
      },
      {
        icon: Shield,
        title: "Privacy First",
        description:
          "All data comes from the public Lichess API. No accounts to create, no data stored on our servers, no tracking.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          All Features
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Everything ChessBoost offers to help you understand and improve your
          chess game.
        </p>
      </div>

      <div className="mt-20 space-y-20">
        {FEATURE_GROUPS.map((group) => (
          <section key={group.title}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">{group.title}</h2>
              <p className="mt-1 text-muted">{group.description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <Card key={feature.title} hoverable>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link href="/">
          <Button size="lg">
            Try It Now <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
