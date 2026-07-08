import { CategoryChart } from "@/components/admin/CategoryChart";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";
import { StatsCard } from "@/components/admin/StatsCard";
import { ThemeChart } from "@/components/admin/ThemeChart";
import { getAdminStats } from "@/lib/admin/queries";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-civic">
            Constituency development intelligence overview
          </p>
        </div>
        <ExportCsvButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard label="Total Submissions" value={stats.total} />
        <StatsCard label="Wards Covered" value={stats.wardCount} />
        <StatsCard label="New Requests" value={stats.statusCounts.new} />
        <StatsCard label="Under Review" value={stats.statusCounts.under_review} />
        <StatsCard label="Completed" value={stats.statusCounts.completed} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-static p-5">
          <h2 className="font-display text-base font-semibold text-ink">Submissions by Category</h2>
          <p className="mt-1 text-sm text-slate-civic">Breakdown of citizen requests</p>
          <div className="mt-4">
            <CategoryChart data={stats.categoryBreakdown} />
          </div>
        </div>

        <div className="card-static p-5">
          <h2 className="font-display text-base font-semibold text-ink">Top Themes by Volume</h2>
          <p className="mt-1 text-sm text-slate-civic">Most recurring development themes</p>
          <div className="mt-4">
            <ThemeChart data={stats.topThemes} />
          </div>
        </div>
      </div>
    </main>
  );
}
