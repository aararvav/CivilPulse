"use client";

import { useCallback, useEffect, useState } from "react";
import { resolvePhotoUrl } from "@/lib/submissions/photo-url";

interface ViewPhotoButtonProps {
  photoUrl: string | null | undefined;
  alt: string;
}

export function ViewPhotoButton({ photoUrl, alt }: ViewPhotoButtonProps) {
  const src = resolvePhotoUrl(photoUrl);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 text-slate-civic"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zM8.25 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            clipRule="evenodd"
          />
        </svg>
        View photo
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo for ${alt}`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/60"
            onClick={close}
            aria-label="Close photo"
          />

          <div className="relative z-10 max-h-[90vh] max-w-3xl overflow-hidden rounded-[12px] border border-line bg-canvas-raised shadow-[var(--shadow-card-hover)]">
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-[12px] border border-line bg-canvas-raised text-slate-civic transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              aria-label="Close"
            >
              ✕
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="block max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
