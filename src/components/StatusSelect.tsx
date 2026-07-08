"use client";

import { useEffect, useState } from "react";
import type { SubmissionStatus } from "@/types/database";

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "planned", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

interface StatusSelectProps {
  submissionId: string;
  value: string;
  onUpdated?: (status: SubmissionStatus) => void;
  compact?: boolean;
}

export function StatusSelect({
  submissionId,
  value,
  onUpdated,
  compact = false,
}: StatusSelectProps) {
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(value);
  }, [value]);

  async function handleChange(newStatus: SubmissionStatus) {
    const previous = status;
    setStatus(newStatus);
    setError(null);
    setSaving(true);
    onUpdated?.(newStatus);

    try {
      const res = await fetch(`/api/submissions/${submissionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update status");
      }
    } catch (err: unknown) {
      setStatus(previous);
      onUpdated?.(previous as SubmissionStatus);
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={compact ? "" : "mt-3"}>
      <label className="sr-only">Update status</label>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as SubmissionStatus)}
        className={`input-field ${compact ? "py-1.5 text-xs" : "text-sm"} ${saving ? "opacity-60" : ""}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
