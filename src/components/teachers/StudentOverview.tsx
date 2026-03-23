"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { LichessUser, PerfStat } from "@/lib/lichess";
import { PERF_LABELS, formatPlayTime } from "@/lib/analysis";
import type { StoredStudent } from "@/hooks/useStudents";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface StudentData {
  user: LichessUser;
  error?: string;
}

const MAIN_PERFS = ["bullet", "blitz", "rapid", "classical"];

function RatingBadge({ perf }: { perf: PerfStat }) {
  const icon =
    perf.prog > 0 ? (
      <TrendingUp className="h-3 w-3 text-green-400" />
    ) : perf.prog < 0 ? (
      <TrendingDown className="h-3 w-3 text-red-400" />
    ) : (
      <Minus className="h-3 w-3 text-muted" />
    );

  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="font-semibold tabular-nums">{perf.rating}</span>
      {icon}
      <span
        className={`tabular-nums ${perf.prog > 0 ? "text-green-400" : perf.prog < 0 ? "text-red-400" : "text-muted"}`}
      >
        {perf.prog > 0 ? "+" : ""}
        {perf.prog}
      </span>
    </span>
  );
}

export function StudentOverview({
  students,
}: {
  students: StoredStudent[];
}) {
  const [data, setData] = useState<Record<string, StudentData>>({});
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    if (students.length === 0) return;
    setLoading(true);
    Promise.all(
      students.map((s) =>
        fetch(`https://lichess.org/api/user/${s.username}`)
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((user: LichessUser) => ({ username: s.username, user }))
          .catch(() => ({
            username: s.username,
            user: null as unknown as LichessUser,
            error: "Failed",
          }))
      )
    ).then((results) => {
      const map: Record<string, StudentData> = {};
      for (const r of results) {
        map[r.username.toLowerCase()] = {
          user: r.user,
          error: "error" in r ? (r.error as string) : undefined,
        };
      }
      setData(map);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.length]);

  if (students.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted text-center py-8">
          Add students from the Manage tab to see their stats here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted">
          {students.length} student{students.length !== 1 ? "s" : ""}
        </h3>
        <Button variant="ghost" size="sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading && Object.keys(data).length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading student data...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => {
            const d = data[student.username.toLowerCase()];
            const user = d?.user;

            if (!d || d.error || !user) {
              return (
                <Card key={student.username} className="border-red-500/20">
                  <div className="text-sm font-medium">{student.username}</div>
                  <p className="mt-1 text-xs text-red-400">
                    {d?.error || "Loading..."}
                  </p>
                </Card>
              );
            }

            const winRate =
              user.count && user.count.all > 0
                ? ((user.count.win / user.count.all) * 100).toFixed(1)
                : "—";

            return (
              <Card key={student.username} hoverable>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="mt-0.5 text-xs text-muted">
                      {user.count?.all.toLocaleString() ?? 0} games &middot;{" "}
                      {winRate}% win rate
                    </div>
                    {user.playTime && (
                      <div className="text-xs text-muted">
                        {formatPlayTime(user.playTime.total)} played
                      </div>
                    )}
                  </div>
                  <Link href={`/analyze/${user.username}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

                {user.perfs && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {MAIN_PERFS.filter(
                      (k) => user.perfs![k] && user.perfs![k].games > 0
                    ).map((k) => (
                      <div
                        key={k}
                        className="rounded-lg bg-background/50 border border-border px-2.5 py-1.5"
                      >
                        <div className="text-[10px] uppercase tracking-wider text-muted">
                          {PERF_LABELS[k]}
                        </div>
                        <RatingBadge perf={user.perfs![k]} />
                      </div>
                    ))}
                  </div>
                )}

                {student.notes && (
                  <div className="mt-3 rounded-lg bg-accent-muted px-2.5 py-1.5 text-xs text-accent truncate">
                    {student.notes}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
