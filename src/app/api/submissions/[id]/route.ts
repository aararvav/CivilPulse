import { NextResponse } from "next/server";
import { extractStoragePath } from "@/lib/submissions/photo-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
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

    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("id, user_id, photo_url")
      .eq("id", params.id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (submission.photo_url) {
      const storagePath = extractStoragePath(submission.photo_url);
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from("submissions")
          .remove([storagePath]);

        if (storageError) {
          console.warn("Storage delete warning:", storageError.message);
        }
      }
    }

    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
