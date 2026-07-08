"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { StatusSelect } from "@/components/StatusSelect";
import { ViewPhotoButton } from "@/components/ViewPhotoButton";
import { AiAnalysisCard } from "@/components/AiAnalysisCard";
import { formatDisplayDate } from "@/lib/date/format";
import { sortSubmissions } from "@/lib/submissions/sort";
import type { SubmissionStatus } from "@/types/database";

export interface AdminSubmissionRow {
  id: string;
  title: string;
  description: string;
  category: string | null;
  ward: string | null;
  status: string;
  priority_score: number;
  created_at: string;
  photo_url: string | null;
  ai_summary: string | null;
}

const STATUSES = ["", "new", "under_review", "planned", "completed", "rejected"];
const CATEGORIES = ["", "education", "roads", "health", "water", "sanitation", "other"];
const WARDS = ["", "Ward 1", "Ward 2", "Ward 3", "Ward 4"];

export function AdminSubmissionsList({
  submissions: initial,
}: {
  submissions: AdminSubmissionRow[];
}) {
  const [items, setItems] = useState(initial);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");

  const filtered = useMemo(() => {
    let result = items;
    if (statusFilter) result = result.filter((s) => s.status === statusFilter);
    if (categoryFilter) result = result.filter((s) => s.category === categoryFilter);
    if (wardFilter) result = result.filter((s) => s.ward === wardFilter);
    return sortSubmissions(result);
  }, [items, statusFilter, categoryFilter, wardFilter]);

  function handleStatusUpdate(id: string, status: SubmissionStatus) {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="label-field text-xs">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-1.5 text-sm"
            >
              <option value="">All</option>
              {STATUSES.filter(Boolean).map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field text-xs">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field py-1.5 text-sm"
            >
              <option value="">All</option>
              {CATEGORIES.filter(Boolean).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field text-xs">Ward</label>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="input-field py-1.5 text-sm"
            >
              {WARDS.map((w) => (
                <option key={w || "all"} value={w}>
                  {w || "All"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ExportCsvButton />
      </div>

      {!filtered.length ? (
        <div className="mt-8">
          <EmptyState
            title="No matching submissions"
            description="Try adjusting your filters to see more results."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="card-static p-5"
            >
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display font-semibold text-ink">{s.title}</h2>
                    <p className="mt-1 font-mono text-xs text-slate-civic capitalize">
                      {s.category ?? "—"} · {s.ward ?? "—"} ·{" "}
                      {formatDisplayDate(s.created_at)}
                    </p>
                    <div className="mt-1">
                      <ViewPhotoButton photoUrl={s.photo_url} alt={s.title} />
                    </div>
                  </div>
                  <PriorityBadge score={s.priority_score} />
                </div>
                <p className="mt-2 text-sm text-ink/80 line-clamp-2">{s.description}</p>
                {s.ai_summary && (
                  <div className="mt-2">
                    <AiAnalysisCard summary={s.ai_summary} />
                  </div>
                )}
                <div className="mt-3 max-w-xs">
                  <p className="mb-1 text-xs font-medium text-slate-civic">Update status</p>
                  <StatusSelect
                    submissionId={s.id}
                    value={s.status}
                    compact
                    onUpdated={(status) => handleStatusUpdate(s.id, status)}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
