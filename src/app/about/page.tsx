import { Card } from "@/components/ui/Card";
import { Crown, Target, Shield, Heart } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Data-Driven Improvement",
    description:
      "We believe every chess player can improve faster by understanding their own patterns. ChessLens turns raw game data into clear, actionable insights.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "We never store your data. All analysis happens on-the-fly using the public Lichess API. No accounts, no tracking, no data collection.",
  },
  {
    icon: Heart,
    title: "Open & Free",
    description:
      "ChessLens is built for the community. Core features are free and always will be. We're powered by the incredible open Lichess platform.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Crown className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">
              Chess<span className="text-accent">Lens</span>
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About ChessLens
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            ChessLens is a chess analytics platform that helps players of all
            levels understand their games, identify weaknesses, and improve
            systematically. We pull data from the Lichess API and transform it
            into meaningful insights.
          </p>
        </div>

        <div className="mt-16 space-y-6">
          {VALUES.map((value) => (
            <Card key={value.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted">
                <value.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{value.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-center">Our Story</h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>
              ChessLens started as a side project by a group of chess
              enthusiasts who were frustrated with the lack of accessible,
              in-depth analytics tools for casual and intermediate players.
            </p>
            <p>
              While strong players have coaches and expensive software, most
              club players have to manually review their games to find patterns.
              We wanted to automate that process and make data-driven chess
              improvement available to everyone.
            </p>
            <p>
              Today, ChessLens analyzes thousands of games daily, helping
              players from beginners to titled players understand where they
              stand and what to work on next.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-accent/20 bg-accent-muted p-8 text-center">
          <h3 className="text-lg font-bold">Want to contribute?</h3>
          <p className="mt-2 text-sm text-muted">
            ChessLens is a community project. If you&apos;re a developer, data
            scientist, or chess coach who wants to help, we&apos;d love to hear
            from you.
          </p>
        </div>
      </div>
    </div>
  );
}
