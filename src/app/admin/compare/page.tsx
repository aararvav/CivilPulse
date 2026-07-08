import { CompareView } from "@/components/admin/CompareView";
import { getCompareData } from "@/lib/admin/queries";

export default async function AdminComparePage() {
  const data = await getCompareData();

  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Demand vs. Data</h1>
        <p className="mt-2 text-sm text-slate-civic">
          Compare citizen education requests against public school enrollment and travel-distance
          data — the core pitch for evidence-based prioritisation
        </p>
      </div>

      <div className="mt-8">
        <CompareView {...data} />
      </div>
    </main>
  );
}
