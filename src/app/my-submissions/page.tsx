import Link from "next/link";
import { Header } from "@/components/Header";
import { MySubmissionsList } from "@/components/MySubmissionsList";
import { sortSubmissions } from "@/lib/submissions/sort";
import { createClient } from "@/lib/supabase/server";

export default async function MySubmissionsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("submissions")
    .select(
      "id, title, description, category, status, created_at, ward, ai_summary, priority_score, photo_url"
    )
    .eq("user_id", user!.id);

  const sorted = sortSubmissions(submissions ?? []);

  return (
    <div className="min-h-screen bg-canvas">
      <Header />

      <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">My Submissions</h1>
            <p className="mt-1 text-sm text-slate-civic">
              Track the status of your development requests.
            </p>
          </div>
          <Link href="/submit" className="btn-primary px-4 py-2 text-sm">
            New request
          </Link>
        </div>

        <div className="mt-8">
          <MySubmissionsList initialSubmissions={sorted} />
        </div>
      </main>
    </div>
  );
}
