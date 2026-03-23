"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, Crown, ExternalLink } from "lucide-react";
import type { LichessUser, PerfStat } from "@/lib/lichess";
import { PERF_LABELS, formatPlayTime } from "@/lib/analysis";
import Link from "next/link";

const COMPARE_PERFS = ["bullet", "blitz", "rapid", "classical", "puzzle"];

interface PlayerData {
  user: LichessUser;
  error?: string;
}

function StatRow({
  label,
  val1,
  val2,
  higherIsBetter = true,
}: {
  label: string;
  val1: number | string;
  val2: number | string;
  higherIsBetter?: boolean;
}) {
  const n1 = typeof val1 === "number" ? val1 : parseFloat(val1);
  const n2 = typeof val2 === "number" ? val2 : parseFloat(val2);
  const diff = n1 - n2;
  const p1Better = higherIsBetter ? diff > 0 : diff < 0;
  const p2Better = higherIsBetter ? diff < 0 : diff > 0;

  return (
    <div className="flex items-center py-2.5 text-sm">
      <div
        className={`flex-1 text-right tabular-nums font-medium ${p1Better ? "text-accent" : ""}`}
      >
        {typeof val1 === "number" ? val1.toLocaleString() : val1}
      </div>
      <div className="w-32 text-center text-xs text-muted shrink-0 px-3">
        {label}
      </div>
      <div
        className={`flex-1 tabular-nums font-medium ${p2Better ? "text-accent" : ""}`}
      >
        {typeof val2 === "number" ? val2.toLocaleString() : val2}
      </div>
    </div>
  );
}

function RatingBar({
  label,
  p1,
  p2,
}: {
  label: string;
  p1?: PerfStat;
  p2?: PerfStat;
}) {
  const r1 = p1?.rating ?? 0;
  const r2 = p2?.rating ?? 0;
  const max = Math.max(r1, r2, 1);
  const w1 = (r1 / max) * 100;
  const w2 = (r2 / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="tabular-nums font-medium text-foreground">
          {r1 || "—"}
        </span>
        <span>{label}</span>
        <span className="tabular-nums font-medium text-foreground">
          {r2 || "—"}
        </span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end">
          <div
            className={`h-full rounded-l-full ${r1 >= r2 ? "bg-accent" : "bg-zinc-600"}`}
            style={{ width: `${w1}%` }}
          />
        </div>
        <div className="flex-1">
          <div
            className={`h-full rounded-r-full ${r2 >= r1 ? "bg-accent" : "bg-zinc-600"}`}
            style={{ width: `${w2}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CompareResults({
  player1,
  player2,
}: {
  player1: string;
  player2: string;
}) {
  const [data, setData] = useState<{
    p1?: PlayerData;
    p2?: PlayerData;
    loading: boolean;
  }>({ loading: true });

  useEffect(() => {
    setData({ loading: true });

    Promise.all([
      fetch(`https://lichess.org/api/user/${player1}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((user: LichessUser) => ({ user }))
        .catch(() => ({ user: null as unknown as LichessUser, error: "Not found" })),
      fetch(`https://lichess.org/api/user/${player2}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((user: LichessUser) => ({ user }))
        .catch(() => ({ user: null as unknown as LichessUser, error: "Not found" })),
    ]).then(([p1, p2]) => {
      setData({ p1, p2, loading: false });
    });
  }, [player1, player2]);

  if (data.loading) {
    return (
      <div className="mt-12 flex items-center justify-center gap-2 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Fetching player data...
      </div>
    );
  }

  if (data.p1?.error || data.p2?.error) {
    return (
      <div className="mt-12 rounded-xl border border-red-500/30 bg-red-900/10 p-8 text-center">
        <h2 className="text-lg font-bold text-red-400">
          Could not load one or both players
        </h2>
        <p className="mt-2 text-sm text-muted">
          {data.p1?.error && `"${player1}" — ${data.p1.error}. `}
          {data.p2?.error && `"${player2}" — ${data.p2.error}.`}
        </p>
      </div>
    );
  }

  const u1 = data.p1!.user;
  const u2 = data.p2!.user;

  return (
    <div className="mt-12 space-y-6">
      <Card>
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-accent" />
            <Link
              href={`/analyze/${u1.username}`}
              className="font-bold hover:text-accent transition-colors"
            >
              {u1.username}
            </Link>
            <Link
              href={`https://lichess.org/@/${u1.username}`}
              target="_blank"
              className="text-muted hover:text-accent"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <span className="text-xs text-muted font-medium">VS</span>
          <div className="flex items-center gap-2">
            <Link
              href={`https://lichess.org/@/${u2.username}`}
              target="_blank"
              className="text-muted hover:text-accent"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link
              href={`/analyze/${u2.username}`}
              className="font-bold hover:text-accent transition-colors"
            >
              {u2.username}
            </Link>
            <Crown className="h-4 w-4 text-accent" />
          </div>
        </div>

        <div className="divide-y divide-border">
          <StatRow
            label="Total Games"
            val1={u1.count?.all ?? 0}
            val2={u2.count?.all ?? 0}
          />
          <StatRow
            label="Wins"
            val1={u1.count?.win ?? 0}
            val2={u2.count?.win ?? 0}
          />
          <StatRow
            label="Play Time"
            val1={u1.playTime ? formatPlayTime(u1.playTime.total) : "—"}
            val2={u2.playTime ? formatPlayTime(u2.playTime.total) : "—"}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-muted mb-4">
          Rating Comparison
        </h3>
        <div className="space-y-4">
          {COMPARE_PERFS.map((perf) => {
            const p1 = u1.perfs?.[perf];
            const p2 = u2.perfs?.[perf];
            if (!p1 && !p2) return null;
            return (
              <RatingBar
                key={perf}
                label={PERF_LABELS[perf] || perf}
                p1={p1}
                p2={p2}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
