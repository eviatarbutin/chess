"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/Card";

interface RatingHistoryEntry {
  name: string;
  points: [number, number, number, number][];
}

const LINE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

export function RatingHistoryChart({
  history,
}: {
  history: RatingHistoryEntry[];
}) {
  const validSeries = history.filter((h) => h.points.length > 0);
  if (validSeries.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No rating history available.</p>
      </Card>
    );
  }

  const allDates = new Map<string, Record<string, number>>();

  for (const series of validSeries) {
    for (const [year, month, day, rating] of series.points) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const existing = allDates.get(key) || {};
      existing[series.name] = rating;
      allDates.set(key, existing);
    }
  }

  const data = Array.from(allDates.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({ date, ...values }));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-muted mb-4">
        Rating History
      </h3>
      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={45}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#16161a",
                border: "1px solid #27272a",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            {validSeries.map((series, i) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        {validSeries.map((series, i) => (
          <span key={series.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
            />
            <span className="text-muted">{series.name}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
