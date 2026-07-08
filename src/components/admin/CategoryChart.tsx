"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_CATEGORY_COLORS, getCategoryLabel } from "@/lib/admin/constants";

interface CategoryChartProps {
  data: { category: string; count: number }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((d) => ({
    name: getCategoryLabel(d.category),
    value: d.count,
    key: d.category,
  }));

  if (chartData.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-slate-civic">
        No submission data yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.key} fill={CHART_CATEGORY_COLORS[entry.key] ?? CHART_CATEGORY_COLORS.other} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
