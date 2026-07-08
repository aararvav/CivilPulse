"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDisplayDate } from "@/lib/date/format";
import { ChakraSpinner } from "@/components/ui/Chakra";

type CategoryOption = "education" | "roads" | "health" | "water" | "sanitation" | "other" | "";

type WardOption = "Ward 1" | "Ward 2" | "Ward 3" | "Ward 4" | "";

interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
}

interface SimilarSubmission {
  id: string;
  title: string;
  created_at: string;
}

export function SubmitForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryOption>("");
  const [ward, setWard] = useState<WardOption>("");
  const [location, setLocation] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [similarSubmission, setSimilarSubmission] = useState<SimilarSubmission | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        // ignore failures; user can still submit without precise coordinates
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  useEffect(() => {
    if (!ward || !category) {
      setSimilarSubmission(null);
      return;
    }

    let cancelled = false;

    async function checkDuplicate() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data } = await supabase
        .from("submissions")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .eq("ward", ward)
        .eq("category", category)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (!cancelled) {
        setSimilarSubmission(data?.[0] ?? null);
      }
    }

    checkDuplicate();
    return () => {
      cancelled = true;
    };
  }, [ward, category]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title || !description) {
      setError("Please provide both a title and description for your request.");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();

      // Get current user to set user_id
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to submit a request.");
      }

      let photo_url: string | null = null;

      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("submissions")
          .upload(filePath, photoFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from("submissions").getPublicUrl(filePath);
        photo_url = data.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("submissions")
        .insert({
          user_id: user.id,
          title,
          description,
          category: category || null,
          ward: ward || null,
          latitude: location.latitude,
          longitude: location.longitude,
          photo_url,
          status: "new",
        })
        .select("id")
        .single();

      if (insertError || !inserted) {
        throw insertError ?? new Error("Failed to create submission");
      }

      // Run AI pipeline (Groq) — non-blocking failure so submission still saves
      try {
        await fetch("/api/submissions/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId: inserted.id }),
        });
      } catch {
        // AI processing failed silently; submission is still saved
      }

      setSuccess("Your request has been submitted. Thank you for sharing this issue.");
      form.reset();
      setCategory("");
      setWard("");
      setPhotoFile(null);
      setSimilarSubmission(null);

      // Navigate to "My Submissions" after a short delay
      setTimeout(() => {
        router.push("/my-submissions");
      }, 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your request.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label-field">
          Title <span className="text-danger">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          className="input-field"
          placeholder="Short title describing the issue (e.g. 'School building repair in Ward 3')"
        />
      </div>

      <div>
        <label htmlFor="description" className="label-field">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="input-field resize-y"
          placeholder="Describe the issue and its impact on residents. You can write in Hindi or English."
        />
        <p className="mt-1.5 text-xs text-slate-civic">
          Avoid sharing sensitive personal information. This will be visible to MP office staff.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="label-field">
            Category <span className="font-normal text-slate-civic">(optional)</span>
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryOption)}
            className="input-field"
          >
            <option value="">Let the system decide</option>
            <option value="education">Education / schools</option>
            <option value="roads">Roads & transport</option>
            <option value="health">Health</option>
            <option value="water">Water supply</option>
            <option value="sanitation">Sanitation & waste</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="ward" className="label-field">
            Ward / Area <span className="text-danger">*</span>
          </label>
          <select
            id="ward"
            name="ward"
            value={ward}
            onChange={(e) => setWard(e.target.value as WardOption)}
            required
            className="input-field"
          >
            <option value="">Select ward</option>
            <option value="Ward 1">Ward 1</option>
            <option value="Ward 2">Ward 2</option>
            <option value="Ward 3">Ward 3</option>
            <option value="Ward 4">Ward 4</option>
          </select>
          <p className="mt-1.5 text-xs text-slate-civic">
            For this MVP, the constituency is limited to a small set of wards.
          </p>
        </div>
      </div>

      {similarSubmission && (
        <div className="rounded-[12px] border border-saffron/40 bg-saffron/5 px-4 py-3 text-sm text-ink">
          <p className="font-medium">You may have already reported something similar</p>
          <p className="mt-1 text-slate-civic">
            &ldquo;{similarSubmission.title}&rdquo; was submitted on{" "}
            {formatDisplayDate(similarSubmission.created_at)}. You can still submit
            this request if it&apos;s a different issue.
          </p>
          <Link
            href="/my-submissions"
            className="mt-2 inline-block text-sm font-medium text-ink underline hover:no-underline"
          >
            View your existing submission →
          </Link>
        </div>
      )}

      <div className="rounded-[12px] border border-line bg-canvas p-4">
        <label className="label-field">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setPhotoFile(file);
          }}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-[12px] file:border-0 file:bg-canvas file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-line/50"
        />
        <p className="mt-1.5 text-xs text-slate-civic">
          A clear photo of the issue helps staff assess urgency.
        </p>
        {photoPreview && (
          <div className="mt-3 overflow-hidden rounded-[12px] border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt="Photo preview"
              className="max-h-48 w-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="rounded-[12px] border border-line bg-canvas p-4">
        <label className="label-field">Location</label>
        <p className="text-xs text-slate-civic">
          We capture your location automatically if you grant permission.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-[12px] border border-dashed border-line bg-canvas-raised px-3 py-2 font-mono text-xs text-slate-civic">
          <span className="inline-flex h-2 w-2 rounded-full bg-success" />
          {location.latitude && location.longitude ? (
            <span>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          ) : (
            <span>Location not yet available or permission denied.</span>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-[12px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-[12px] border border-success/20 bg-success/5 px-3 py-2 text-sm text-success">
          {success}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <ChakraSpinner label="Submitting" />
            Submitting…
          </span>
        ) : (
          "Submit request"
        )}
      </button>
    </form>
  );
}

