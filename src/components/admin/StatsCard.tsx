interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="card-static p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <p className="text-sm font-medium text-slate-civic">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-civic">{sub}</p>}
    </div>
  );
}
