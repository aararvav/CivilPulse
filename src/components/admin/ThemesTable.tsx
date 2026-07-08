"use client";

import { Fragment, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusSelect } from "@/components/StatusSelect";
import { ViewPhotoButton } from "@/components/ViewPhotoButton";
import { AiAnalysisCard } from "@/components/AiAnalysisCard";
import { sortSubmissions } from "@/lib/submissions/sort";
import type { SubmissionStatus } from "@/types/database";

export interface ThemeRow {
  id: string;
  name: string;
  description: string | null;
  submission_count: number;
  avg_priority: number;
  rank_score: number;
  submissions: {
    id: string;
    title: string;
    ward: string | null;
    category: string | null;
    status: string;
    priority_score: number;
    ai_summary: string | null;
    photo_url: string | null;
  }[];
}

export function ThemesTable({ themes: initialThemes }: { themes: ThemeRow[] }) {
  const [themes, setThemes] = useState(initialThemes);
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleStatusUpdate(themeId: string, submissionId: string, status: SubmissionStatus) {
    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === themeId
          ? {
              ...theme,
              submissions: theme.submissions.map((s) =>
                s.id === submissionId ? { ...s, status } : s
              ),
            }
          : theme
      )
    );
  }

  if (themes.length === 0) {
    return (
      <EmptyState
        title="No themes yet"
        description="Themes are created when submissions are AI-processed."
      />
    );
  }

  return (
    <div className="card-static overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-canvas text-left text-slate-civic">
          <tr>
            <th className="px-4 py-3 font-medium">Theme</th>
            <th className="px-4 py-3 text-right font-medium">Submissions</th>
            <th className="px-4 py-3 text-right font-medium">Avg Priority</th>
            <th className="px-4 py-3 text-right font-medium">Rank Score</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {themes.map((theme) => {
            const isOpen = expanded === theme.id;
            const sortedSubs = sortSubmissions(theme.submissions);
            return (
              <Fragment key={theme.id}>
                <tr className="text-ink transition-colors hover:bg-canvas">
                  <td className="px-4 py-3">
                    <p className="font-display font-medium text-ink">{theme.name}</p>
                    {theme.description && (
                      <p className="mt-0.5 text-xs text-slate-civic">{theme.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">
                    {theme.submission_count}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {theme.avg_priority.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-lg font-semibold text-ink">
                    {theme.rank_score.toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : theme.id)}
                      className="text-xs font-medium text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {isOpen ? "Hide" : "View"} ({sortedSubs.length})
                    </button>
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={5} className="bg-canvas px-4 py-4">
                      <div className="space-y-3">
                        {sortedSubs.map((sub) => (
                          <div
                            key={sub.id}
                            className="rounded-[12px] border border-line bg-canvas-raised p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-ink">{sub.title}</p>
                                <p className="font-mono text-xs text-slate-civic">
                                  {sub.ward} ·{" "}
                                  <span className="capitalize">{sub.category}</span>
                                </p>
                                <div className="mt-1">
                                  <ViewPhotoButton photoUrl={sub.photo_url} alt={sub.title} />
                                </div>
                                {sub.ai_summary && (
                                  <div className="mt-2">
                                    <AiAnalysisCard summary={sub.ai_summary} />
                                  </div>
                                )}
                                <div className="mt-2 max-w-xs">
                                  <p className="mb-1 text-xs font-medium text-slate-civic">
                                    Update status
                                  </p>
                                  <StatusSelect
                                    submissionId={sub.id}
                                    value={sub.status}
                                    compact
                                    onUpdated={(status) =>
                                      handleStatusUpdate(theme.id, sub.id, status)
                                    }
                                  />
                                </div>
                              </div>
                              <PriorityBadge score={sub.priority_score} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
