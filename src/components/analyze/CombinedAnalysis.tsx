"use client";

import { Card } from "@/components/ui/Card";
import { WinLossChart } from "@/components/analyze/WinLossChart";
import { WeaknessCards } from "@/components/analyze/WeaknessCards";
import type { ChessUser, PerfStat } from "@/lib/chess-provider";
import type { GameStats, Weakness } from "@/lib/analysis";
import { PERF_LABELS } from "@/lib/analysis";
import {
  Crown,
  ExternalLink,
  ShieldAlert,
  TrendingUp,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MAIN_PERFS = ["bullet", "blitz", "rapid", "classical", "puzzle"];

function StatRow({
  label,
  val1,
  val2,
  combined,
  higherIsBetter = true,
}: {
  label: string;
  val1: number | string;
  val2: number | string;
  combined: number | string;
  higherIsBetter?: boolean;
}) {
  const n1 = typeof val1 === "number" ? val1 : parseFloat(val1);
  const n2 = typeof val2 === "number" ? val2 : parseFloat(val2);
  const p1Better = higherIsBetter ? n1 > n2 : n1 < n2;
  const p2Better = higherIsBetter ? n2 > n1 : n2 < n1;

  return (
    <div className="flex items-center py-2.5 text-sm">
      <div
        className={`flex-1 text-right tabular-nums font-medium ${p1Better ? "text-accent" : ""}`}
      >
        {typeof val1 === "number" ? val1.toLocaleString() : val1}
      </div>
      <div className="w-28 text-center text-xs text-muted shrink-0 px-2">
        {label}
      </div>
      <div
        className={`flex-1 tabular-nums font-medium ${p2Better ? "text-accent" : ""}`}
      >
        {typeof val2 === "number" ? val2.toLocaleString() : val2}
      </div>
      <div className="w-24 text-right tabular-nums font-semibold text-accent shrink-0 pl-3 border-l border-border ml-3">
        {typeof combined === "number" ? combined.toLocaleString() : combined}
      </div>
    </div>
  );
}

function WeaknessSummary({
  weaknesses,
  label,
}: {
  weaknesses: Weakness[];
  label: string;
}) {
  const highCount = weaknesses.filter((w) => w.severity === "high").length;
  const mediumCount = weaknesses.filter((w) => w.severity === "medium").length;
  const lowCount = weaknesses.length - highCount - mediumCount;

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted mb-3">{label}</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted">
          <ShieldAlert className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="text-sm font-semibold">
            {weaknesses.length} area{weaknesses.length !== 1 ? "s" : ""} identified
          </div>
          <div className="text-xs text-muted">
            {highCount > 0 && (
              <span className="text-red-400">{highCount} critical</span>
            )}
            {highCount > 0 && mediumCount > 0 && " · "}
            {mediumCount > 0 && (
              <span className="text-yellow-400">{mediumCount} moderate</span>
            )}
            {(highCount > 0 || mediumCount > 0) && " · "}
            {lowCount} minor
          </div>
        </div>
      </div>
      <WeaknessCards weaknesses={weaknesses} />
    </div>
  );
}

type WeaknessTab = "combined" | "lichess" | "chesscom";

interface Props {
  lichessUsername: string;
  chesscomUsername: string;
  lichessUser: ChessUser;
  chesscomUser: ChessUser;
  lichessStats: GameStats;
  chesscomStats: GameStats;
  combinedStats: GameStats;
  combinedWeaknesses: Weakness[];
  lichessWeaknesses: Weakness[];
  chesscomWeaknesses: Weakness[];
  mergedPerfs: Record<
    string,
    { lichess?: PerfStat; chesscom?: PerfStat; best: PerfStat }
  >;
  lichessGameCount: number;
  chesscomGameCount: number;
}

export function CombinedAnalysis({
  lichessUsername,
  chesscomUsername,
  lichessStats,
  chesscomStats,
  combinedStats,
  combinedWeaknesses,
  lichessWeaknesses,
  chesscomWeaknesses,
  mergedPerfs,
  lichessGameCount,
  chesscomGameCount,
}: Props) {
  const [weaknessTab, setWeaknessTab] = useState<WeaknessTab>("combined");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-muted">
            <Layers className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Combined Analysis</h1>
            <p className="text-sm text-muted">
              Unified stats across both platforms
            </p>
          </div>
        </div>
      </div>

      {/* Platform accounts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted">
            <Crown className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/analyze/${encodeURIComponent(lichessUsername)}`}
                className="font-semibold text-sm hover:text-accent transition-colors truncate"
              >
                {lichessUsername}
              </Link>
              <span className="inline-flex items-center rounded-full bg-background border border-border px-2 py-0.5 text-xs text-muted shrink-0">
                Lichess
              </span>
            </div>
            <p className="text-xs text-muted">{lichessGameCount} games analyzed</p>
          </div>
          <Link
            href={`https://lichess.org/@/${lichessUsername}`}
            target="_blank"
            className="text-muted hover:text-accent shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted">
            <Crown className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/analyze/${encodeURIComponent(chesscomUsername)}?platform=chesscom`}
                className="font-semibold text-sm hover:text-accent transition-colors truncate"
              >
                {chesscomUsername}
              </Link>
              <span className="inline-flex items-center rounded-full bg-background border border-border px-2 py-0.5 text-xs text-muted shrink-0">
                Chess.com
              </span>
            </div>
            <p className="text-xs text-muted">{chesscomGameCount} games analyzed</p>
          </div>
          <Link
            href={`https://www.chess.com/member/${chesscomUsername}`}
            target="_blank"
            className="text-muted hover:text-accent shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      {/* Combined stat cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Total Games", value: combinedStats.total },
          {
            label: "Overall Win Rate",
            value: `${combinedStats.winRate.toFixed(1)}%`,
          },
          { label: "Total Wins", value: combinedStats.wins },
          { label: "Total Losses", value: combinedStats.losses },
        ].map((stat) => (
          <Card key={stat.label} hoverable>
            <div className="text-xs font-medium text-muted uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums text-accent">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Platform comparison */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted">
            Platform Comparison
          </h3>
          <div className="flex gap-4 text-xs text-muted">
            <span>Lichess</span>
            <span>Chess.com</span>
            <span className="font-semibold text-accent">Combined</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          <StatRow
            label="Games"
            val1={lichessStats.total}
            val2={chesscomStats.total}
            combined={combinedStats.total}
          />
          <StatRow
            label="Wins"
            val1={lichessStats.wins}
            val2={chesscomStats.wins}
            combined={combinedStats.wins}
          />
          <StatRow
            label="Losses"
            val1={lichessStats.losses}
            val2={chesscomStats.losses}
            combined={combinedStats.losses}
          />
          <StatRow
            label="Draws"
            val1={lichessStats.draws}
            val2={chesscomStats.draws}
            combined={combinedStats.draws}
          />
          <StatRow
            label="Win Rate"
            val1={`${lichessStats.winRate.toFixed(1)}%`}
            val2={`${chesscomStats.winRate.toFixed(1)}%`}
            combined={`${combinedStats.winRate.toFixed(1)}%`}
          />
        </div>
      </Card>

      {/* Ratings comparison */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-muted">
            Rating Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="py-2 text-left font-medium">Time Control</th>
                <th className="py-2 text-center font-medium">Lichess</th>
                <th className="py-2 text-center font-medium">Chess.com</th>
                <th className="py-2 text-right font-medium">Best</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MAIN_PERFS.filter((k) => mergedPerfs[k]).map((key) => {
                const entry = mergedPerfs[key];
                return (
                  <tr key={key}>
                    <td className="py-2.5 font-medium">
                      {PERF_LABELS[key] || key}
                    </td>
                    <td className="py-2.5 text-center tabular-nums">
                      {entry.lichess ? (
                        <span>
                          {entry.lichess.rating}
                          <span className="text-xs text-muted ml-1">
                            ({entry.lichess.games.toLocaleString()})
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                    <td className="py-2.5 text-center tabular-nums">
                      {entry.chesscom ? (
                        <span>
                          {entry.chesscom.rating}
                          <span className="text-xs text-muted ml-1">
                            ({entry.chesscom.games.toLocaleString()})
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-semibold text-accent">
                      {entry.best.rating}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Combined win/loss chart */}
      <div>
        <h3 className="text-sm font-semibold text-muted mb-3">
          Combined Results ({combinedStats.total} games)
        </h3>
        <WinLossChart stats={combinedStats} />
      </div>

      {/* Weaknesses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Weaknesses</h2>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {(
              [
                { key: "combined", label: "Combined" },
                { key: "lichess", label: "Lichess" },
                { key: "chesscom", label: "Chess.com" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setWeaknessTab(tab.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  weaknessTab === tab.key
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {weaknessTab === "combined" && (
          <WeaknessSummary
            weaknesses={combinedWeaknesses}
            label={`Cross-platform weaknesses from ${combinedStats.total} games`}
          />
        )}
        {weaknessTab === "lichess" && (
          <WeaknessSummary
            weaknesses={lichessWeaknesses}
            label={`Lichess weaknesses (${lichessUsername}) from ${lichessStats.total} games`}
          />
        )}
        {weaknessTab === "chesscom" && (
          <WeaknessSummary
            weaknesses={chesscomWeaknesses}
            label={`Chess.com weaknesses (${chesscomUsername}) from ${chesscomStats.total} games`}
          />
        )}
      </div>
    </div>
  );
}
