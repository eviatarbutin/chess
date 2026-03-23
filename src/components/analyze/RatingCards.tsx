import { Card } from "@/components/ui/Card";
import type { PerfStat } from "@/lib/lichess";
import { PERF_LABELS } from "@/lib/analysis";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MAIN_PERFS = ["bullet", "blitz", "rapid", "classical", "puzzle"];

export function RatingCards({
  perfs,
}: {
  perfs: Record<string, PerfStat>;
}) {
  const entries = MAIN_PERFS.filter((k) => perfs[k] && perfs[k].games > 0).map(
    (k) => ({ key: k, label: PERF_LABELS[k] || k, ...perfs[k] })
  );

  if (entries.length === 0) return null;

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {entries.map((perf) => {
        const progIcon =
          perf.prog > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
          ) : perf.prog < 0 ? (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-muted" />
          );

        return (
          <Card key={perf.key} hoverable>
            <div className="text-xs font-medium text-muted uppercase tracking-wider">
              {perf.label}
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums">
              {perf.rating}
              {perf.prov && (
                <span className="text-sm text-muted font-normal">?</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {progIcon}
              <span
                className={
                  perf.prog > 0
                    ? "text-green-400"
                    : perf.prog < 0
                      ? "text-red-400"
                      : "text-muted"
                }
              >
                {perf.prog > 0 ? "+" : ""}
                {perf.prog}
              </span>
              <span className="text-muted ml-1">
                {perf.games.toLocaleString()} games
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
