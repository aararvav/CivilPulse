import { ThemesTable } from "@/components/admin/ThemesTable";
import { getThemesWithSubmissions } from "@/lib/admin/queries";

export default async function AdminThemesPage() {
  const themes = await getThemesWithSubmissions();

  return (
    <main className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Development Themes</h1>
        <p className="mt-2 text-sm text-slate-civic">
          Sorted by rank score (submissions × avg priority) · expand to view linked requests
        </p>
      </div>

      <div className="mt-8">
        <ThemesTable themes={themes} />
      </div>
    </main>
  );
}
