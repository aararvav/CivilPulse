"use client";

import { useState } from "react";
import { SubmissionMap, type MapSubmission } from "@/components/admin/SubmissionMap";
import { WARDS } from "@/lib/admin/constants";
import { formatDisplayDate } from "@/lib/date/format";

interface WardDataset {
  ward: string;
  enrollment: number | null;
  travelDistance: number | null;
}

interface CompareViewProps {
  educationSubmissions: MapSubmission[];
  datasets: WardDataset[];
  wardCounts: Record<string, number>;
  otherCounts: Record<string, number>;
  dataAsOf: string | null;
}

export function CompareView({
  educationSubmissions,
  datasets,
  wardCounts,
  otherCounts,
  dataAsOf,
}: CompareViewProps) {
  const [ward, setWard] = useState<string>(WARDS[0]);

  const wardEducation = educationSubmissions.filter((s) => s.ward === ward);
  const educationCount = wardCounts[ward] ?? wardEducation.length;
  const vocationalCount = otherCounts[ward] ?? 0;

  const wardData = datasets.find((d) => d.ward === ward);
  const enrollment = wardData?.enrollment ?? null;
  const travelDistance = wardData?.travelDistance ?? null;

  const recommendation = buildRecommendation({
    ward,
    educationCount,
    enrollment,
    travelDistance,
    vocationalCount,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="ward-select" className="label-field mb-0">
          Select ward
        </label>
        <select
          id="ward-select"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          {WARDS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[12px] border border-line bg-canvas-raised p-5 pl-6 chakra-accent-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink">Recommendation</p>
        <p className="mt-2 text-sm leading-relaxed text-ink">{recommendation}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-static border-l-4 border-l-saffron p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Citizen Demand — Education</h2>
          <p className="mt-1 text-sm text-slate-civic">
            <span className="font-mono font-semibold text-ink">{educationCount}</span> school-related
            submissions in {ward}
          </p>
          <div className="mt-4">
            <SubmissionMap submissions={wardEducation} compact wardFilter={ward} />
          </div>
          <ul className="mt-4 max-h-40 space-y-2 overflow-y-auto">
            {wardEducation.slice(0, 5).map((s) => (
              <li key={s.id} className="text-sm text-ink">
                <span className="font-medium">{s.title}</span>
                {s.ai_summary && (
                  <span className="block text-xs text-slate-civic line-clamp-1">{s.ai_summary}</span>
                )}
              </li>
            ))}
            {wardEducation.length > 5 && (
              <li className="font-mono text-xs text-slate-civic">
                +{wardEducation.length - 5} more submissions
              </li>
            )}
          </ul>
        </div>

        <div className="card-static border-l-4 border-l-civic-green p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Public Data — Schools</h2>
          <p className="mt-1 text-sm text-slate-civic">Official ward-level education metrics</p>
          {dataAsOf && (
            <p className="mt-1 font-mono text-xs text-slate-civic">
              Data as of {formatDisplayDate(dataAsOf)}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[12px] border border-line bg-canvas p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-civic">
                School Enrollment
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold text-ink">
                {enrollment != null ? enrollment.toLocaleString() : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-civic">students ({ward})</p>
            </div>
            <div className="rounded-[12px] border border-line bg-canvas p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-civic">
                Avg Travel Distance
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold text-ink">
                {travelDistance != null ? `${travelDistance} km` : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-civic">to nearest school ({ward})</p>
            </div>
          </div>

          <div className="mt-6 rounded-[12px] border border-success/30 bg-success/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-success">
              Demand vs. Data Signal
            </p>
            <p className="mt-2 text-sm text-ink">
              {educationCount >= vocationalCount
                ? `Citizen submissions (${educationCount}) outweigh alternative proposals (${vocationalCount}) in ${ward}, supported by enrollment of ${enrollment?.toLocaleString() ?? "N/A"} students.`
                : `Alternative proposals (${vocationalCount}) currently match or exceed school submissions (${educationCount}) in ${ward}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildRecommendation({
  ward,
  educationCount,
  enrollment,
  travelDistance,
  vocationalCount,
}: {
  ward: string;
  educationCount: number;
  enrollment: number | null;
  travelDistance: number | null;
  vocationalCount: number;
}) {
  const enrollmentText =
    enrollment != null
      ? `enrollment stands at ${enrollment.toLocaleString()} students`
      : "enrollment data is limited";
  const travelText =
    travelDistance != null
      ? `average travel distance is ${travelDistance} km`
      : "travel distance data is limited";

  if (educationCount > vocationalCount) {
    return `${educationCount} submissions requesting school upgrades in ${ward}, where ${enrollmentText} and ${travelText} — higher demand signal than Vocational Centre proposal (${vocationalCount} submissions).`;
  }

  return `${educationCount} school-related submissions in ${ward} (${enrollmentText}, ${travelText}) — comparable to Vocational Centre proposal (${vocationalCount} submissions); review both against ward data before prioritising.`;
}
