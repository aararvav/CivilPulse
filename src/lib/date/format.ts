export type Dateish = string | number | Date | null | undefined;

const DISPLAY_DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDisplayDate(value: Dateish): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return DISPLAY_DATE.format(d);
}

