"use client";

import dynamic from "next/dynamic";

import type { Category, Report } from "@/types";
import type {
  MapBaseLayer,
  MapViewMode,
} from "./EnvironmentalMap";

// Leaflet usa window/document, que no existen en el servidor.
// Por eso el mapa real se carga dinámicamente solo en el cliente (ssr: false).
const EnvironmentalMap = dynamic(() => import("./EnvironmentalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
      Cargando mapa...
    </div>
  ),
});

interface MapViewProps {
  reports: Report[];
  categories: Category[];
  viewMode: MapViewMode;
  baseLayer: MapBaseLayer;
  focusCoords: { lat: number; lng: number } | null;
  fitKey: number;
  onSelectReport: (report: Report) => void;
}

export function MapView({
  reports,
  categories,
  viewMode,
  baseLayer,
  focusCoords,
  fitKey,
  onSelectReport,
}: MapViewProps) {
  return (
    <div className="h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200">
      <EnvironmentalMap
        reports={reports}
        categories={categories}
        viewMode={viewMode}
        baseLayer={baseLayer}
        focusCoords={focusCoords}
        fitKey={fitKey}
        onSelectReport={onSelectReport}
      />
    </div>
  );
}
