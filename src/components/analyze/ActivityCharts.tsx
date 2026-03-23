"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { TimeStats } from "@/lib/analysis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTooltip: any = (value: number, name: string) => {
  if (name === "games") return [value, "Games"];
  if (name === "winRate") return [`${value.toFixed(1)}%`, "Win Rate"];
  return [value, name];
};

function winRateColor(rate: number): string {
  if (rate >= 60) return "#22c55e";
  if (rate >= 50) return "#4ade80";
  if (rate >= 40) return "#f59e0b";
  return "#ef4444";
}

export function ActivityCharts({ stats }: { stats: TimeStats }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Best Day", value: stats.bestDay, sub: "Highest win rate" },
          { label: "Worst Day", value: stats.worstDay, sub: "Lowest win rate" },
          { label: "Best Time", value: stats.bestHour, sub: "Highest win rate" },
          { label: "Most Active", value: stats.peakActivity, sub: "Most games played" },
        ].map((item) => (
          <Card key={item.label} hoverable>
            <div className="text-xs font-medium text-muted uppercase tracking-wider">
              {item.label}
            </div>
            <div className="mt-2 text-xl font-bold text-accent">{item.value}</div>
            <div className="mt-0.5 text-xs text-muted">{item.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-muted mb-1">Games by Day of Week</h3>
        <p className="text-xs text-muted mb-4">Bar color reflects win rate</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byDayOfWeek} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(0, 3)}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  background: "#16161a",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={formatTooltip}
                cursor={false}
              />
              <Bar dataKey="games" radius={[6, 6, 0, 0]}>
                {stats.byDayOfWeek.map((entry, i) => (
                  <Cell key={i} fill={winRateColor(entry.winRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
          {stats.byDayOfWeek.map((d) => (
            <span key={d.day}>
              {d.day.slice(0, 3)}: {d.games}g, {d.winRate.toFixed(0)}% W
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-muted mb-1">Games by Hour of Day</h3>
        <p className="text-xs text-muted mb-4">Times shown in your local timezone</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byHour} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "#16161a",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={formatTooltip}
                cursor={false}
              />
              <Bar dataKey="games" radius={[4, 4, 0, 0]}>
                {stats.byHour.map((entry, i) => (
                  <Cell key={i} fill={entry.games > 0 ? winRateColor(entry.winRate) : "#27272a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-muted mb-1">Win Rate by Hour</h3>
        <p className="text-xs text-muted mb-4">Only hours with games played</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.byHour.filter((h) => h.games > 0)}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "#16161a",
                  border: "1px solid #27272a",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={formatTooltip}
                cursor={false}
              />
              <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                {stats.byHour
                  .filter((h) => h.games > 0)
                  .map((entry, i) => (
                    <Cell key={i} fill={winRateColor(entry.winRate)} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
