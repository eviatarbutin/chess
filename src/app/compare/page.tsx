"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompareResults } from "@/components/analyze/CompareResults";

export default function ComparePage() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<{
    p1: string;
    p2: string;
  } | null>(null);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1.trim() || !player2.trim()) return;
    setComparing(true);
    setResult({ p1: player1.trim(), p2: player2.trim() });
    setComparing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Head-to-Head
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          Compare two Lichess players side by side.
        </p>
      </div>

      <form
        onSubmit={handleCompare}
        className="mx-auto mt-10 max-w-2xl"
      >
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1.5">
                Player 1
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={player1}
                  onChange={(e) => setPlayer1(e.target.value)}
                  placeholder="Lichess username..."
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div className="hidden sm:flex items-center justify-center pb-1 text-muted">
              vs
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-muted mb-1.5">
                Player 2
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={player2}
                  onChange={(e) => setPlayer2(e.target.value)}
                  placeholder="Lichess username..."
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!player1.trim() || !player2.trim() || comparing}
              className="shrink-0"
            >
              {comparing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Compare <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>

      {result && <CompareResults player1={result.p1} player2={result.p2} />}
    </div>
  );
}
