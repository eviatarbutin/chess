"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { OpeningStat } from "@/lib/analysis";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

type SortKey = "games" | "winRate" | "avgRatingDiff";

export function OpeningTable({ openings }: { openings: OpeningStat[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("games");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...openings].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 text-muted" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-accent" />
    ) : (
      <ChevronDown className="h-3 w-3 text-accent" />
    );
  };

  if (openings.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No opening data available.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-6 py-3 font-medium">ECO</th>
              <th className="px-6 py-3 font-medium">Opening</th>
              <th
                className="px-6 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("games")}
              >
                <span className="inline-flex items-center gap-1">
                  Games <SortIcon col="games" />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">W / D / L</th>
              <th
                className="px-6 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("winRate")}
              >
                <span className="inline-flex items-center gap-1">
                  Win % <SortIcon col="winRate" />
                </span>
              </th>
              <th
                className="px-6 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("avgRatingDiff")}
              >
                <span className="inline-flex items-center gap-1">
                  Avg &Delta; <SortIcon col="avgRatingDiff" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.slice(0, 30).map((o) => (
              <tr
                key={o.eco + o.name}
                className="hover:bg-card-hover transition-colors"
              >
                <td className="px-6 py-3 font-mono text-xs text-accent">
                  {o.eco}
                </td>
                <td className="px-6 py-3 font-medium max-w-[200px] truncate">
                  {o.name}
                </td>
                <td className="px-6 py-3 tabular-nums">{o.games}</td>
                <td className="px-6 py-3 tabular-nums text-xs">
                  <span className="text-green-400">{o.wins}</span>
                  {" / "}
                  <span className="text-muted">{o.draws}</span>
                  {" / "}
                  <span className="text-red-400">{o.losses}</span>
                </td>
                <td className="px-6 py-3 tabular-nums">
                  <span
                    className={
                      o.winRate >= 55
                        ? "text-green-400"
                        : o.winRate < 45
                          ? "text-red-400"
                          : "text-foreground"
                    }
                  >
                    {o.winRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-3 tabular-nums">
                  <span
                    className={
                      o.avgRatingDiff > 0
                        ? "text-green-400"
                        : o.avgRatingDiff < 0
                          ? "text-red-400"
                          : "text-muted"
                    }
                  >
                    {o.avgRatingDiff > 0 ? "+" : ""}
                    {o.avgRatingDiff.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
