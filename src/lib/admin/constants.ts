export const CATEGORY_COLORS: Record<string, string> = {
  education: "#2563eb",
  roads: "#ea580c",
  health: "#dc2626",
  water: "#0891b2",
  sanitation: "#7c3aed",
  other: "#64748b",
};

/** Palette-aligned colors for Recharts (not map pins) */
export const CHART_CATEGORY_COLORS: Record<string, string> = {
  education: "#0B1F3A",
  roads: "#FF9933",
  health: "#C0392B",
  water: "#4A5568",
  sanitation: "#138808",
  other: "#94a3b8",
};

export const CHART_INK = "#0B1F3A";
export const CHART_SAFFRON = "#FF9933";
export const CHART_GREEN = "#138808";

export const CATEGORY_LABELS: Record<string, string> = {
  education: "Education",
  roads: "Roads",
  health: "Health",
  water: "Water",
  sanitation: "Sanitation",
  other: "Other",
};

export const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4"] as const;

export const MAP_DEFAULT_CENTER: [number, number] = [77.209, 28.6139];
export const MAP_DEFAULT_ZOOM = 12;

export function getCategoryColor(category: string | null): string {
  return CATEGORY_COLORS[category ?? "other"] ?? CATEGORY_COLORS.other;
}

export function getCategoryLabel(category: string | null): string {
  return CATEGORY_LABELS[category ?? "other"] ?? "Other";
}
