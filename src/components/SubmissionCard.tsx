import { AiAnalysisCard } from "@/components/AiAnalysisCard";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusTimeline } from "@/components/StatusTimeline";
import { ViewPhotoButton } from "@/components/ViewPhotoButton";
import { formatDisplayDate } from "@/lib/date/format";
import { resolvePhotoUrl } from "@/lib/submissions/photo-url";

interface SubmissionCardProps {
  id?: string;
  title: string;
  description: string;
  category: string | null;
  ward: string | null;
  status: string;
  createdAt: string;
  aiSummary: string | null;
  priorityScore: number;
  photoUrl?: string | null;
  showDescription?: boolean;
  showTimeline?: boolean;
  deleteButton?: React.ReactNode;
}

export function SubmissionCard({
  title,
  description,
  category,
  ward,
  status,
  createdAt,
  aiSummary,
  priorityScore,
  photoUrl,
  showDescription = true,
  showTimeline = false,
  deleteButton,
}: SubmissionCardProps) {
  return (
    <article className="card-static p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-civic">
            {category && (
              <span className="rounded-full border border-line bg-canvas px-2 py-0.5 capitalize text-ink">
                {category}
              </span>
            )}
            {ward && <span>{ward}</span>}
            <span>·</span>
            <span>{formatDisplayDate(createdAt)}</span>
          </div>
          {resolvePhotoUrl(photoUrl) && (
            <div className="mt-1">
              <ViewPhotoButton photoUrl={photoUrl} alt={title} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <PriorityBadge score={priorityScore} />
          <span className="inline-flex rounded-full border border-line bg-canvas px-2.5 py-0.5 text-xs font-medium capitalize text-slate-civic">
            {status.replace("_", " ")}
          </span>
        </div>
      </div>

      {showDescription && description && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-civic">
            Citizen description
          </p>
          <p className="text-sm leading-relaxed text-ink/90 line-clamp-3">{description}</p>
        </div>
      )}

      {showTimeline && <StatusTimeline status={status} />}

      {aiSummary ? (
        <div className="mt-4">
          <AiAnalysisCard summary={aiSummary} />
        </div>
      ) : (
        <p className="mt-4 text-xs italic text-slate-civic">AI analysis pending…</p>
      )}

      {deleteButton && <div className="mt-4 flex justify-end">{deleteButton}</div>}
    </article>
  );
}
