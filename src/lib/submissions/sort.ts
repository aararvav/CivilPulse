import type { SubmissionStatus } from "@/types/database";

const ACTIVE_STATUSES: SubmissionStatus[] = ["new", "under_review", "planned"];
const INACTIVE_STATUSES: SubmissionStatus[] = ["completed", "rejected"];

function isActiveStatus(status: string): boolean {
  return ACTIVE_STATUSES.includes(status as SubmissionStatus);
}

export function sortSubmissions<T extends { status: string; priority_score: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aActive = isActiveStatus(a.status);
    const bActive = isActiveStatus(b.status);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    return (b.priority_score ?? 0) - (a.priority_score ?? 0);
  });
}
