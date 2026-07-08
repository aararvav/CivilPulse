import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/types/database";

const VALID_STATUSES: SubmissionStatus[] = [
  "new",
  "under_review",
  "planned",
  "completed",
  "rejected",
];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const status = body.status as SubmissionStatus;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("submissions")
      .update({ status })
      .eq("id", params.id)
      .select("id, status")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ submission: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
