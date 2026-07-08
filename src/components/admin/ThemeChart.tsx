"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_INK } from "@/lib/admin/constants";

interface ThemeChartProps {
  data: { name: string; count: number }[];
}

export function ThemeChart({ data }: ThemeChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-slate-civic">
        No themes yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-line)" />
        <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--color-slate)", fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fill: "var(--color-ink)", fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--color-line)",
            fontFamily: "var(--font-body)",
          }}
        />
        <Bar dataKey="count" fill={CHART_INK} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
