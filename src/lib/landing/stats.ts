import { createAdminClient } from "@/lib/supabase/admin";

export async function getLandingStats() {
  const admin = createAdminClient();

  const { count: totalSubmissions } = await admin
    .from("submissions")
    .select("id", { count: "exact", head: true });

  const { data: wardRows } = await admin
    .from("submissions")
    .select("ward");

  const wards = new Set((wardRows ?? []).map((r) => r.ward).filter(Boolean));

  const { count: themeCount } = await admin
    .from("themes")
    .select("id", { count: "exact", head: true });

  return {
    totalSubmissions: totalSubmissions ?? 0,
    wardCount: wards.size,
    themeCount: themeCount ?? 0,
    analysisTime: "< 10 sec",
  };
}
