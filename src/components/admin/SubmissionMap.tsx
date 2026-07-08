"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusSelect } from "@/components/StatusSelect";
import { ViewPhotoButton } from "@/components/ViewPhotoButton";
import { AiAnalysisCard } from "@/components/AiAnalysisCard";
import {
  getCategoryColor,
  getCategoryLabel,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
} from "@/lib/admin/constants";
import type { SubmissionStatus } from "@/types/database";

export interface MapSubmission {
  id: string;
  title: string;
  description: string;
  category: string | null;
  ward: string | null;
  latitude: number;
  longitude: number;
  ai_summary: string | null;
  priority_score: number;
  status: string;
  photo_url: string | null;
}

interface SubmissionMapProps {
  submissions: MapSubmission[];
  compact?: boolean;
  wardFilter?: string | null;
}

export function SubmissionMap({
  submissions: initialSubmissions,
  compact = false,
  wardFilter = null,
}: SubmissionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const filtered = wardFilter
    ? submissions.filter((s) => s.ward === wardFilter)
    : submissions;
  const selected = selectedId
    ? submissions.find((s) => s.id === selectedId) ?? null
    : null;

  useEffect(() => {
    setSubmissions(initialSubmissions);
  }, [initialSubmissions]);

  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !token) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filtered.forEach((sub) => {
      const el = document.createElement("div");
      el.className = "cursor-pointer rounded-full border-2 border-white shadow-md";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.backgroundColor = getCategoryColor(sub.category);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([sub.longitude, sub.latitude])
        .addTo(map);

      el.addEventListener("click", () => setSelectedId(sub.id));
      markersRef.current.push(marker);
    });

    if (filtered.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filtered.forEach((s) => bounds.extend([s.longitude, s.latitude]));
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [filtered, token]);

  function handleStatusUpdate(id: string, status: SubmissionStatus) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  if (!token) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-[12px] border border-dashed border-line bg-canvas p-6 text-center">
        <p className="text-sm font-medium text-ink">Mapbox token required</p>
        <p className="mt-2 max-w-sm text-xs text-slate-civic">
          Add <code className="rounded bg-canvas px-1 font-mono text-[11px]">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to
          your <code className="rounded bg-canvas px-1 font-mono text-[11px]">.env</code> file and restart the dev
          server.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className={`w-full overflow-hidden rounded-[12px] border border-line ${
          compact ? "h-72" : "h-[520px]"
        }`}
      />

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs text-slate-civic">
          {["education", "roads", "health", "water", "sanitation", "other"].map((cat) => (
            <span key={cat} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              {getCategoryLabel(cat)}
            </span>
          ))}
        </div>
      )}

      {selected && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md rounded-[12px] border border-line bg-canvas-raised p-4 shadow-[var(--shadow-card-hover)] sm:right-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display font-semibold text-ink">{selected.title}</p>
              <p className="mt-1 font-mono text-xs capitalize text-slate-civic">
                {getCategoryLabel(selected.category)} · {selected.ward}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="text-slate-civic hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="mt-2 text-sm text-ink/80 line-clamp-2">{selected.description}</p>
          {selected.ai_summary && <div className="mt-2"><AiAnalysisCard summary={selected.ai_summary} /></div>}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <PriorityBadge score={selected.priority_score} />
          </div>
          <div className="mt-2">
            <ViewPhotoButton photoUrl={selected.photo_url} alt={selected.title} />
          </div>
          <div className="mt-3 max-w-xs">
            <p className="mb-1 text-xs font-medium text-slate-civic">Update status</p>
            <StatusSelect
              submissionId={selected.id}
              value={selected.status}
              compact
              onUpdated={(status) => handleStatusUpdate(selected.id, status)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
