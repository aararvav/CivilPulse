"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DeleteSubmissionButton } from "@/components/DeleteSubmissionButton";
import { EmptyState } from "@/components/EmptyState";
import { SubmissionCard } from "@/components/SubmissionCard";
import { sortSubmissions } from "@/lib/submissions/sort";

export interface CitizenSubmission {
  id: string;
  title: string;
  description: string;
  category: string | null;
  ward: string | null;
  status: string;
  created_at: string;
  ai_summary: string | null;
  priority_score: number;
  photo_url: string | null;
}

export function MySubmissionsList({
  initialSubmissions,
}: {
  initialSubmissions: CitizenSubmission[];
}) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(
    sortSubmissions(initialSubmissions)
  );

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  useEffect(() => {
    setSubmissions(sortSubmissions(initialSubmissions));
  }, [initialSubmissions]);

  function handleDeleted(id: string) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  if (!submissions.length) {
    return (
      <EmptyState
        title="No submissions yet"
        description="You haven't submitted any development requests. Share a local need with your MP office."
        action={
          <Link href="/submit" className="btn-primary text-sm">
            Submit your first request
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((s) => (
        <SubmissionCard
          key={s.id}
          id={s.id}
          title={s.title}
          description={s.description}
          category={s.category}
          ward={s.ward}
          status={s.status}
          createdAt={s.created_at}
          aiSummary={s.ai_summary}
          priorityScore={s.priority_score}
          photoUrl={s.photo_url}
          showTimeline
          deleteButton={
            <DeleteSubmissionButton submissionId={s.id} onDeleted={handleDeleted} />
          }
        />
      ))}
    </div>
  );
}
