"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { LichessUser, LichessGame } from "@/lib/lichess";
import {
  computeGameStats,
  computeOpeningStats,
  detectWeaknesses,
} from "@/lib/analysis";
import type { Weakness } from "@/lib/analysis";
import type { StoredStudent } from "@/hooks/useStudents";
import {
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface StudentWeaknessData {
  username: string;
  weaknesses: Weakness[];
  gameCount: number;
  error?: string;
}

const SEVERITY_STYLES = {
  high: {
    icon: AlertTriangle,
    color: "text-red-400",
    badge: "bg-red-900/40 text-red-400",
  },
  medium: {
    icon: AlertCircle,
    color: "text-yellow-400",
    badge: "bg-yellow-900/40 text-yellow-400",
  },
  low: {
    icon: Info,
    color: "text-blue-400",
    badge: "bg-blue-900/40 text-blue-400",
  },
};

async function fetchWeaknesses(
  username: string
): Promise<StudentWeaknessData> {
  try {
    const [userRes, gamesRes] = await Promise.all([
      fetch(`https://lichess.org/api/user/${username}`),
      fetch(
        `https://lichess.org/api/games/user/${username}?max=100&opening=true`,
        { headers: { Accept: "application/x-ndjson" } }
      ),
    ]);

    if (!userRes.ok) {
      return { username, weaknesses: [], gameCount: 0, error: "User not found" };
    }

    const user: LichessUser = await userRes.json();
    const gamesText = await gamesRes.text();
    const games: LichessGame[] = gamesText
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    const stats = computeGameStats(games, username);
    const openings = computeOpeningStats(games, username);
    const weaknesses = detectWeaknesses(stats, openings, user);

    return { username, weaknesses, gameCount: games.length };
  } catch {
    return {
      username,
      weaknesses: [],
      gameCount: 0,
      error: "Failed to fetch data",
    };
  }
}

export function StudentWeaknesses({
  students,
}: {
  students: StoredStudent[];
}) {
  const [data, setData] = useState<StudentWeaknessData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchAll = () => {
    if (students.length === 0) return;
    setLoading(true);
    Promise.all(students.map((s) => fetchWeaknesses(s.username))).then(
      (results) => {
        setData(results);
        setLoading(false);
        setExpanded(new Set(results.map((r) => r.username)));
      }
    );
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students.length]);

  const toggleExpand = (username: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  if (students.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted text-center py-8">
          Add students from the Manage tab to analyze their weaknesses.
        </p>
      </Card>
    );
  }

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Analyzing student games... This may take a moment.
      </div>
    );
  }

  const totalIssues = data.reduce(
    (acc, d) => acc + d.weaknesses.filter((w) => w.severity !== "low" || w.title !== "Keep It Up!").length,
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-muted">
            {totalIssues} issue{totalIssues !== 1 ? "s" : ""} found across{" "}
            {data.length} student{data.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchAll} disabled={loading}>
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Re-analyze
        </Button>
      </div>

      {data.map((student) => {
        const isExpanded = expanded.has(student.username);
        const highCount = student.weaknesses.filter(
          (w) => w.severity === "high"
        ).length;
        const medCount = student.weaknesses.filter(
          (w) => w.severity === "medium"
        ).length;

        return (
          <Card key={student.username} className="overflow-hidden p-0">
            <button
              onClick={() => toggleExpand(student.username)}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-card-hover transition-colors text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{student.username}</div>
                <div className="text-xs text-muted">
                  {student.gameCount} games analyzed
                  {student.error && (
                    <span className="text-red-400 ml-2">{student.error}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 text-xs shrink-0">
                {highCount > 0 && (
                  <span className="rounded-full bg-red-900/40 px-2 py-0.5 text-red-400 font-medium">
                    {highCount} critical
                  </span>
                )}
                {medCount > 0 && (
                  <span className="rounded-full bg-yellow-900/40 px-2 py-0.5 text-yellow-400 font-medium">
                    {medCount} moderate
                  </span>
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border px-6 py-4 space-y-3">
                {student.weaknesses.map((w, i) => {
                  const style = SEVERITY_STYLES[w.severity];
                  const Icon = style.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon
                        className={`h-4 w-4 mt-0.5 shrink-0 ${style.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{w.title}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize ${style.badge}`}
                          >
                            {w.severity}
                          </span>
                          <span className="text-[10px] text-muted">
                            {w.category}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          {w.description}
                        </p>
                        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-accent">
                          <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                          {w.suggestion}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-border">
                  <Link
                    href={`/analyze/${student.username}/weaknesses`}
                    className="text-xs text-accent hover:underline"
                  >
                    View full analysis for {student.username} &rarr;
                  </Link>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
