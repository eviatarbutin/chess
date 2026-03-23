"use client";

import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const [username, setUsername] = useState("");

  return (
    <section className="relative overflow-hidden chess-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-4 py-1.5 text-sm text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Powered by the Lichess API
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Understand your chess.{" "}
            <span className="text-accent">Improve faster.</span>
          </h1>

          <p className="mt-6 text-lg text-muted leading-relaxed sm:text-xl">
            Enter your Lichess username and get deep analytics on your games,
            rating trends, opening repertoire, weaknesses, and personalized
            improvement plans.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (username.trim()) {
                window.location.href = `/analyze/${encodeURIComponent(username.trim())}`;
              }
            }}
            className="mt-10 mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Lichess username..."
                className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
              />
            </div>
            <Button type="submit" size="lg" className="shrink-0">
              Analyze <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted">
            Free to use &middot; No account required &middot; Works with any
            Lichess profile
          </p>
        </div>

        <div className="mt-16 flex justify-center gap-8 sm:gap-16 text-center">
          {[
            { value: "10M+", label: "Games Analyzed" },
            { value: "50K+", label: "Players" },
            { value: "98%", label: "Accuracy" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-accent sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
