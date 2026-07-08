"use client";

import Image from "next/image";
import { resolvePhotoUrl } from "@/lib/submissions/photo-url";

interface SubmissionPhotoProps {
  photoUrl: string | null | undefined;
  alt: string;
  className?: string;
}

export function SubmissionPhoto({ photoUrl, alt, className = "" }: SubmissionPhotoProps) {
  const src = resolvePhotoUrl(photoUrl);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-[12px] border border-dashed border-line bg-canvas text-slate-civic ${className}`}
      >
        <div className="flex flex-col items-center gap-1.5 p-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6 opacity-50"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <span className="text-xs">No photo attached</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-[12px] border border-line bg-canvas ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
        unoptimized
      />
    </div>
  );
}
