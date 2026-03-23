import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-card to-card p-10 sm:p-16 text-center animate-pulse-glow">
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to improve your game?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted text-lg leading-relaxed">
              Join thousands of chess players who use ChessLens to find their
              weaknesses and climb the rating ladder.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/analyze">
                <Button size="lg">
                  Start Analyzing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="secondary" size="lg">
                  View All Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
