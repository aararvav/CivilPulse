import { SubmissionMap } from "@/components/admin/SubmissionMap";
import { getMapSubmissions } from "@/lib/admin/queries";

export default async function AdminMapPage() {
  const submissions = await getMapSubmissions();

  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Submission Map</h1>
        <p className="mt-2 text-sm text-slate-civic">
          <span className="font-mono font-semibold text-ink">{submissions.length}</span> geolocated
          submissions · click a pin for details
        </p>
      </div>

      <div className="mt-8">
        <SubmissionMap submissions={submissions} />
      </div>
    </main>
  );
}
