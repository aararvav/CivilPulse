import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { processSubmission } from "../src/lib/ai/process-submission";
import { createAdminClient } from "../src/lib/supabase/admin";

async function main() {
  const admin = createAdminClient();
  const force = process.argv.includes("--force");

  let query = admin
    .from("submissions")
    .select("id, title")
    .order("created_at", { ascending: true });

  if (!force) {
    query = query.is("ai_summary", null);
  }

  const { data: submissions, error } = await query;

  if (error) throw error;

  const total = submissions?.length ?? 0;
  console.log(`Found ${total} submissions to process${force ? " (force reprocess)" : ""}.`);

  let processed = 0;
  let failed = 0;

  for (const sub of submissions ?? []) {
    try {
      console.log(`[${processed + failed + 1}/${total}] ${sub.title}`);
      const result = await processSubmission(sub.id, force);
      if (result.skipped) {
        console.log("  → skipped (already processed)");
      } else {
        console.log(`  → category: ${result.analysis?.category}, score: ${result.analysis?.priority_score}`);
        processed++;
      }
      // Brief pause to respect Groq rate limits (30 RPM on free tier)
      await new Promise((r) => setTimeout(r, 2500));
    } catch (err) {
      failed++;
      console.error(`  → FAILED:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nDone. Processed: ${processed}, Failed: ${failed}, Skipped: ${total - processed - failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
