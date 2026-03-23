"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { GameStats } from "@/lib/analysis";

const COLORS = { wins: "#22c55e", losses: "#ef4444", draws: "#71717a" };

export function WinLossChart({ stats }: { stats: GameStats }) {
  const data = [
    { name: "Wins", value: stats.wins, color: COLORS.wins },
    { name: "Losses", value: stats.losses, color: COLORS.losses },
    { name: "Draws", value: stats.draws, color: COLORS.draws },
  ];

  const colorData = [
    {
      name: "White",
      wins: stats.asWhite.wins,
      losses: stats.asWhite.losses,
      draws: stats.asWhite.draws,
    },
    {
      name: "Black",
      wins: stats.asBlack.wins,
      losses: stats.asBlack.losses,
      draws: stats.asBlack.draws,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h3 className="text-sm font-semibold text-muted mb-4">
          Results Overview
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barSize={24}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={60}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#16161a",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={false}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex justify-center gap-6 text-xs text-muted">
          <span>
            Win rate:{" "}
            <span className="font-semibold text-green-400">
              {stats.winRate.toFixed(1)}%
            </span>
          </span>
          <span>Total: {stats.total} games</span>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-muted mb-4">By Color</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={colorData} barSize={20}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#16161a",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={false}
              />
              <Bar dataKey="wins" stackId="a" fill={COLORS.wins} radius={[0, 0, 0, 0]} />
              <Bar dataKey="draws" stackId="a" fill={COLORS.draws} />
              <Bar
                dataKey="losses"
                stackId="a"
                fill={COLORS.losses}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex justify-center gap-4 text-xs">
          {Object.entries(COLORS).map(([label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: color }}
              />
              <span className="capitalize text-muted">{label}</span>
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
