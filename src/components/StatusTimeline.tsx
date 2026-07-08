const STEPS = [
  { key: "new", label: "Received" },
  { key: "under_review", label: "Under Review" },
  { key: "planned", label: "Planned" },
  { key: "completed", label: "Completed" },
] as const;

function stepIndex(status: string): number {
  const idx = STEPS.findIndex((s) => s.key === status);
  if (status === "completed") return 3;
  if (status === "rejected") return -1;
  return idx >= 0 ? idx : 0;
}

export function StatusTimeline({ status }: { status: string }) {
  if (status === "rejected") {
    return (
      <div className="mt-4 rounded-[12px] border border-danger/30 bg-danger/5 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-danger">
          Request Rejected
        </p>
        <p className="mt-0.5 text-xs text-slate-civic">
          This submission was not approved for further action.
        </p>
      </div>
    );
  }

  const current = stepIndex(status);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-civic">
        Progress
      </p>
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = i <= current;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-mono font-semibold ${
                    done
                      ? i === current && status !== "completed"
                        ? "border-ink bg-ink text-white"
                        : "border-success bg-success text-white"
                      : "border-line bg-canvas-raised text-slate-civic"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`mt-1 hidden text-center text-[10px] leading-tight sm:block ${
                    done ? "font-medium text-ink" : "text-slate-civic"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${
                    i < current ? "bg-success" : "bg-line"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
