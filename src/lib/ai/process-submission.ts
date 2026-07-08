import { analyzeSubmission } from "@/lib/ai/groq";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubmissionCategory } from "@/types/database";

const CATEGORY_THEME_NAMES: Record<SubmissionCategory, string> = {
  education: "Education & Schools",
  roads: "Roads & Transport",
  health: "Health Services",
  water: "Water Supply",
  sanitation: "Sanitation & Waste",
  other: "Other Development",
};

function computeRefinedPriority(
  aiScore: number,
  sameCategoryWardCount: number
): number {
  const demandWeight = sameCategoryWardCount * 10;
  const finalScore = aiScore * 0.5 + demandWeight * 0.5;
  return Math.min(100, Math.round(finalScore));
}

async function upsertThemeAndLink(
  submissionId: string,
  category: SubmissionCategory
) {
  const admin = createAdminClient();
  const themeName = CATEGORY_THEME_NAMES[category];

  let themeId: string;

  const { data: existing } = await admin
    .from("themes")
    .select("id")
    .eq("name", themeName)
    .maybeSingle();

  if (existing) {
    themeId = existing.id;
  } else {
    const { data: created, error } = await admin
      .from("themes")
      .insert({ name: themeName, description: `Requests related to ${themeName.toLowerCase()}` })
      .select("id")
      .single();

    if (error || !created) throw error ?? new Error("Failed to create theme");
    themeId = created.id;
  }

  await admin.from("submission_themes").upsert(
    { submission_id: submissionId, theme_id: themeId },
    { onConflict: "submission_id,theme_id" }
  );

  const { data: links } = await admin
    .from("submission_themes")
    .select("submission_id")
    .eq("theme_id", themeId);

  const submissionIds = (links ?? []).map((l) => l.submission_id);

  const { data: subs } = await admin
    .from("submissions")
    .select("priority_score")
    .in("id", submissionIds);

  const scores = (subs ?? []).map((s) => s.priority_score);
  const avgPriority =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  await admin
    .from("themes")
    .update({
      submission_count: scores.length,
      avg_priority: Math.round(avgPriority * 100) / 100,
    })
    .eq("id", themeId);
}

export async function processSubmission(submissionId: string, force = false) {
  const admin = createAdminClient();

  const { data: submission, error: fetchError } = await admin
    .from("submissions")
    .select("id, title, description, ward, category, ai_summary")
    .eq("id", submissionId)
    .single();

  if (fetchError || !submission) {
    throw new Error(`Submission not found: ${submissionId}`);
  }

  if (submission.ai_summary && !force) {
    return { submissionId, skipped: true };
  }

  const analysis = await analyzeSubmission(
    submission.title,
    submission.description
  );

  const category = analysis.category;
  const ward = submission.ward ?? "";

  const { count } = await admin
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("category", category)
    .eq("ward", ward)
    .neq("id", submissionId);

  const sameCategoryWardCount = (count ?? 0) + 1;

  const refinedPriority = computeRefinedPriority(
    analysis.priority_score,
    sameCategoryWardCount
  );

  const { error: updateError } = await admin
    .from("submissions")
    .update({
      language: analysis.language_detected,
      translated_text: analysis.translated_text,
      category,
      ai_summary: analysis.ai_summary,
      priority_score: refinedPriority,
    })
    .eq("id", submissionId);

  if (updateError) throw updateError;

  await upsertThemeAndLink(submissionId, category);

  return {
    submissionId,
    skipped: false,
    analysis: { ...analysis, priority_score: refinedPriority },
  };
}
