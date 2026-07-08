import { AdminSubmissionsList } from "@/components/admin/AdminSubmissionsList";
import { sortSubmissions } from "@/lib/submissions/sort";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminSubmissionsPage() {
  const admin = createAdminClient();

  const { data: submissions } = await admin
    .from("submissions")
    .select(
      "id, title, description, category, ward, status, priority_score, created_at, photo_url, ai_summary"
    );

  const sorted = sortSubmissions(submissions ?? []);

  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">All Submissions</h1>
        <p className="mt-2 text-sm text-slate-civic">
          <span className="font-mono font-semibold text-ink">{sorted.length}</span> total ·
          filter by ward, category, or status
        </p>
      </div>

      <div className="mt-8">
        <AdminSubmissionsList submissions={sorted} />
      </div>
    </main>
  );
}
