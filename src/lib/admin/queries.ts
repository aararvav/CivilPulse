import { sortSubmissions } from "@/lib/submissions/sort";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminStats() {
  const admin = createAdminClient();

  const { data: submissions } = await admin
    .from("submissions")
    .select("category, status, ward");

  const { data: themes } = await admin
    .from("themes")
    .select("name, submission_count, avg_priority")
    .order("submission_count", { ascending: false })
    .limit(5);

  const total = submissions?.length ?? 0;

  const categoryMap = new Map<string, number>();
  for (const s of submissions ?? []) {
    const cat = s.category ?? "other";
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  const statusCounts = {
    new: 0,
    under_review: 0,
    planned: 0,
    completed: 0,
    rejected: 0,
  };
  for (const s of submissions ?? []) {
    const st = s.status as keyof typeof statusCounts;
    if (st in statusCounts) statusCounts[st]++;
  }

  const topThemes = (themes ?? []).map((t) => ({
    name: t.name,
    count: t.submission_count,
  }));

  const wards = new Set((submissions ?? []).map((s) => s.ward).filter(Boolean));

  return {
    total,
    categoryBreakdown,
    topThemes,
    statusCounts,
    wardCount: wards.size,
  };
}

export async function getMapSubmissions() {
  const admin = createAdminClient();

  const { data } = await admin
    .from("submissions")
    .select(
      "id, title, description, category, ward, latitude, longitude, ai_summary, priority_score, status, photo_url"
    )
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  const mapped = (data ?? []).map((s) => ({
    ...s,
    latitude: Number(s.latitude),
    longitude: Number(s.longitude),
  }));

  return sortSubmissions(mapped);
}

export async function getThemesWithSubmissions() {
  const admin = createAdminClient();

  const { data: themes } = await admin
    .from("themes")
    .select("id, name, description, submission_count, avg_priority");

  const { data: links } = await admin
    .from("submission_themes")
    .select("theme_id, submission_id");

  const { data: submissions } = await admin
    .from("submissions")
    .select("id, title, ward, category, status, priority_score, ai_summary, photo_url");

  const submissionMap = new Map(
    (submissions ?? []).map((s) => [s.id, s] as const)
  );

  type SubmissionRow = NonNullable<typeof submissions>[number];

  const themesWithSubs = (themes ?? []).map((theme) => {
    const themeSubmissionIds = (links ?? [])
      .filter((l) => l.theme_id === theme.id)
      .map((l) => l.submission_id);

    const themeSubmissions = themeSubmissionIds
      .map((id) => submissionMap.get(id))
      .filter((s): s is SubmissionRow => Boolean(s));

    return {
      ...theme,
      rank_score: theme.submission_count * theme.avg_priority,
      submissions: sortSubmissions(themeSubmissions),
    };
  });

  return themesWithSubs.sort((a, b) => b.rank_score - a.rank_score);
}

export async function getCompareData() {
  const admin = createAdminClient();

  const { data: educationSubs } = await admin
    .from("submissions")
    .select(
      "id, title, description, category, ward, latitude, longitude, ai_summary, priority_score, status, photo_url"
    )
    .eq("category", "education")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  const { data: allSubs } = await admin
    .from("submissions")
    .select("ward, category");

  const { data: datasets } = await admin
    .from("datasets")
    .select("ward, metric_name, metric_value, updated_at");

  const wardCounts: Record<string, number> = {};
  const otherCounts: Record<string, number> = {};

  for (const s of allSubs ?? []) {
    if (!s.ward) continue;
    if (s.category === "education") {
      wardCounts[s.ward] = (wardCounts[s.ward] ?? 0) + 1;
    }
    if (s.category === "other") {
      otherCounts[s.ward] = (otherCounts[s.ward] ?? 0) + 1;
    }
  }

  const wardDatasets: Record<string, { enrollment: number | null; travelDistance: number | null }> =
    {};

  for (const row of datasets ?? []) {
    if (!row.ward) continue;
    if (!wardDatasets[row.ward]) {
      wardDatasets[row.ward] = { enrollment: null, travelDistance: null };
    }
    if (row.metric_name === "school_enrollment") {
      wardDatasets[row.ward].enrollment = Number(row.metric_value);
    }
    if (row.metric_name === "avg_travel_distance_km") {
      wardDatasets[row.ward].travelDistance = Number(row.metric_value);
    }
  }

  const datasetTimestamps = (datasets ?? [])
    .map((d) => d.updated_at)
    .filter((t): t is string => Boolean(t));
  const dataAsOf =
    datasetTimestamps.length > 0
      ? datasetTimestamps.reduce((latest, t) => (t > latest ? t : latest))
      : null;

  return {
    educationSubmissions: sortSubmissions(
      (educationSubs ?? []).map((s) => ({
        ...s,
        latitude: Number(s.latitude),
        longitude: Number(s.longitude),
      }))
    ),
    datasets: Object.entries(wardDatasets).map(([ward, data]) => ({
      ward,
      ...data,
    })),
    wardCounts,
    otherCounts,
    dataAsOf,
  };
}
