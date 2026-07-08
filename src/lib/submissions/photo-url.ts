const BUCKET = "submissions";

/** Extract storage object path from a full Supabase public URL or relative path. */
export function extractStoragePath(photoUrl: string): string | null {
  if (!photoUrl) return null;

  const publicMarker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = photoUrl.indexOf(publicMarker);
  if (idx !== -1) {
    return decodeURIComponent(photoUrl.slice(idx + publicMarker.length));
  }

  // Relative path stored by mistake
  if (!photoUrl.startsWith("http")) {
    return photoUrl.replace(new RegExp(`^${BUCKET}/`), "");
  }

  return null;
}

/** Resolve a displayable public URL from full URL or relative storage path. */
export function resolvePhotoUrl(photoUrl: string | null | undefined): string | null {
  if (!photoUrl) return null;

  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  const path = photoUrl.replace(new RegExp(`^${BUCKET}/`), "");
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}
