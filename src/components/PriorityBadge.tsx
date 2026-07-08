function getPriorityLevel(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

const STYLES = {
  high: "border-danger/30 bg-danger/10 text-danger",
  medium: "border-warning/30 bg-warning/10 text-warning",
  low: "border-success/30 bg-success/10 text-success",
} as const;

const LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export function PriorityBadge({ score }: { score: number }) {
  if (score <= 0) {
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-xs font-medium text-slate-civic">
        Pending
      </span>
    );
  }

  const level = getPriorityLevel(score);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${STYLES[level]}`}
      title={`Priority score: ${score}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {LABELS[level]} · {score}
    </span>
  );
}
