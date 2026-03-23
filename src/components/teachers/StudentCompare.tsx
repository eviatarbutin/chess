"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { LichessUser, PerfStat } from "@/lib/lichess";
import { PERF_LABELS } from "@/lib/analysis";
import type { StoredStudent } from "@/hooks/useStudents";
import { Loader2, BarChart3 } from "lucide-react";

const COMPARE_PERFS = ["bullet", "blitz", "rapid", "classical", "puzzle"];

interface FetchedStudent {
  username: string;
  user: LichessUser | null;
}

function CompareBar({
  label,
  values,
  usernames,
}: {
  label: string;
  values: (number | undefined)[];
  usernames: string[];
}) {
  const maxVal = Math.max(...values.map((v) => v ?? 0), 1);
  const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#a855f7",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#f97316",
  ];

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted font-medium">{label}</div>
      {values.map((val, i) => (
        <div key={usernames[i]} className="flex items-center gap-2">
          <span className="w-24 text-xs text-muted truncate text-right">
            {usernames[i]}
          </span>
          <div className="flex-1 h-4 rounded-full bg-background/50 border border-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((val ?? 0) / maxVal) * 100}%`,
                backgroundColor: COLORS[i % COLORS.length],
              }}
            />
          </div>
          <span className="w-12 text-xs tabular-nums font-medium text-right">
            {val ?? "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StudentCompare({
  students,
}: {
  students: StoredStudent[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fetched, setFetched] = useState<FetchedStudent[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedList = useMemo(
    () => students.filter((s) => selected.has(s.username)),
    [students, selected]
  );

  const toggle = (username: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  const handleCompare = () => {
    if (selectedList.length < 2) return;
    setLoading(true);
    Promise.all(
      selectedList.map((s) =>
        fetch(`https://lichess.org/api/user/${s.username}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((user: LichessUser | null) => ({
            username: s.username,
            user,
          }))
          .catch(() => ({ username: s.username, user: null }))
      )
    ).then((results) => {
      setFetched(results);
      setLoading(false);
    });
  };

  useEffect(() => {
    setFetched([]);
  }, [selected.size]);

  if (students.length < 2) {
    return (
      <Card>
        <p className="text-sm text-muted text-center py-8">
          You need at least 2 students to compare. Add more from the Manage
          tab.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-sm font-semibold mb-3">
          Select students to compare
        </h3>
        <div className="flex flex-wrap gap-2">
          {students.map((s) => {
            const isSelected = selected.has(s.username);
            return (
              <button
                key={s.username}
                onClick={() => toggle(s.username)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-accent bg-accent-muted text-accent"
                    : "border-border text-muted hover:border-accent/30 hover:text-foreground"
                }`}
              >
                {s.username}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <Button
            onClick={handleCompare}
            disabled={selectedList.length < 2 || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <BarChart3 className="h-4 w-4" /> Compare{" "}
                {selectedList.length > 0 ? `(${selectedList.length})` : ""}
              </>
            )}
          </Button>
        </div>
      </Card>

      {fetched.length >= 2 && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold text-muted mb-4">
              General Stats
            </h3>
            <div className="space-y-5">
              <CompareBar
                label="Total Games"
                values={fetched.map((f) => f.user?.count?.all)}
                usernames={fetched.map((f) => f.username)}
              />
              <CompareBar
                label="Wins"
                values={fetched.map((f) => f.user?.count?.win)}
                usernames={fetched.map((f) => f.username)}
              />
              <CompareBar
                label="Win Rate %"
                values={fetched.map((f) => {
                  const c = f.user?.count;
                  return c && c.all > 0
                    ? Math.round((c.win / c.all) * 100)
                    : undefined;
                })}
                usernames={fetched.map((f) => f.username)}
              />
              <CompareBar
                label="Play Time (hours)"
                values={fetched.map((f) =>
                  f.user?.playTime
                    ? Math.round(f.user.playTime.total / 3600)
                    : undefined
                )}
                usernames={fetched.map((f) => f.username)}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-muted mb-4">
              Rating Comparison
            </h3>
            <div className="space-y-5">
              {COMPARE_PERFS.map((perf) => {
                const hasAny = fetched.some(
                  (f) =>
                    f.user?.perfs?.[perf] &&
                    (f.user.perfs[perf] as PerfStat).games > 0
                );
                if (!hasAny) return null;

                return (
                  <CompareBar
                    key={perf}
                    label={PERF_LABELS[perf] || perf}
                    values={fetched.map((f) => {
                      const p = f.user?.perfs?.[perf] as
                        | PerfStat
                        | undefined;
                      return p && p.games > 0 ? p.rating : undefined;
                    })}
                    usernames={fetched.map((f) => f.username)}
                  />
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-muted mb-4">
              Recent Progress (rating change)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="pb-2 pr-4 font-medium">Student</th>
                    {COMPARE_PERFS.map((p) => (
                      <th key={p} className="pb-2 px-3 font-medium text-center">
                        {PERF_LABELS[p]?.slice(0, 5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fetched.map((f) => (
                    <tr key={f.username}>
                      <td className="py-2 pr-4 font-medium">{f.username}</td>
                      {COMPARE_PERFS.map((perf) => {
                        const p = f.user?.perfs?.[perf] as
                          | PerfStat
                          | undefined;
                        if (!p || p.games === 0)
                          return (
                            <td
                              key={perf}
                              className="py-2 px-3 text-center text-muted"
                            >
                              —
                            </td>
                          );
                        return (
                          <td
                            key={perf}
                            className={`py-2 px-3 text-center tabular-nums font-medium ${
                              p.prog > 0
                                ? "text-green-400"
                                : p.prog < 0
                                  ? "text-red-400"
                                  : "text-muted"
                            }`}
                          >
                            {p.prog > 0 ? "+" : ""}
                            {p.prog}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
