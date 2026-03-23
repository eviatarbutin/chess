import {
  TrendingUp,
  BarChart3,
  BookOpen,
  Target,
  Clock,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Rating Trends",
    description:
      "Track your Elo across blitz, rapid, bullet, and classical. See how you've evolved over weeks, months, and years.",
  },
  {
    icon: BarChart3,
    title: "Game Statistics",
    description:
      "Win/loss/draw ratios, performance by color, time control breakdowns, and streak analysis.",
  },
  {
    icon: BookOpen,
    title: "Opening Analysis",
    description:
      "Discover which openings give you the best results and which ones are costing you rating points.",
  },
  {
    icon: Target,
    title: "Weakness Detection",
    description:
      "AI-powered pattern recognition finds recurring mistakes in your endgames, tactics, and time management.",
  },
  {
    icon: Clock,
    title: "Time Management",
    description:
      "Analyze how you spend your clock. Find out if you're moving too fast in the opening or too slow in critical positions.",
  },
  {
    icon: Zap,
    title: "Improvement Plan",
    description:
      "Get a personalized training roadmap based on your specific weaknesses and playing patterns.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="text-accent">level up</span>
          </h2>
          <p className="mt-4 text-muted text-lg">
            Deep analytics pulled directly from the Lichess API, processed and
            presented so you can act on them immediately.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} hoverable>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
