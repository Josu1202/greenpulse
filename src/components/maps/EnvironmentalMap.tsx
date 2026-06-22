"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Link from "next/link";

import type { Category, Report } from "@/types";
import {
  formatReportDate,
  getCategoryColor,
  getCategoryName,
} from "@/features/reports/reportPresentation";
import { PriorityBadge, StatusBadge } from "@/components/reports";
import {
  getMapCenter,
  getReportsBounds,
  impactWeight,
} from "@/features/map/mapHelpers";

export type MapViewMode = "markers" | "heat";
export type MapBaseLayer = "map" | "satellite";

interface EnvironmentalMapProps {
  reports: Report[];
  categories: Category[];
  viewMode: MapViewMode;
  baseLayer: MapBaseLayer;
  focusCoords: { lat: number; lng: number } | null;
  fitKey: number;
  onSelectReport: (report: Report) => void;
}

function categoryPin(color: string) {
  return L.divIcon({
    className: "greenpulse-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 1.5px rgba(15,23,42,0.25)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function clusterPin(count: number) {
  const size = count >= 50 ? 52 : count >= 10 ? 46 : 38;
  return L.divIcon({
    className: "greenpulse-cluster",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:rgba(22,163,74,0.85);color:#fff;font-weight:600;font-size:13px;border:3px solid #ffffff;box-shadow:0 1px 4px rgba(15,23,42,0.3)">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function heatColor(ratio: number): string {
  if (ratio < 0.34) return "#fbbf24";
  if (ratio < 0.67) return "#f97316";
  return "#dc2626";
}

// Reencuadra el mapa para que entren todos los reportes visibles.
function FitBounds({ reports, fitKey }: { reports: Report[]; fitKey: number }) {
  const map = useMap();
  const bounds = getReportsBounds(reports);
  const boundsKey = bounds ? JSON.stringify(bounds) : "none";

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsKey, fitKey]);

  return null;
}

// Centra el mapa cuando se busca una dirección o se usa "mi ubicación".
function FocusController({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  return null;
}

// Agrupa marcadores cercanos (clustering) según el zoom actual.
function ClusterLayer({
  reports,
  categories,
  onSelectReport,
}: {
  reports: Report[];
  categories: Category[];
  onSelectReport: (report: Report) => void;
}) {
  const map = useMap();
  const [tick, setTick] = useState(0);

  useMapEvents({
    moveend: () => setTick((t) => t + 1),
    zoomend: () => setTick((t) => t + 1),
  });

  useEffect(() => {
    setTick((t) => t + 1);
  }, []);

  // tick fuerza el recálculo al mover/zoom.
  void tick;

  const GRID = 64;
  const buckets = new Map<
    string,
    { items: Report[]; sumX: number; sumY: number }
  >();

  for (const report of reports) {
    const point = map.latLngToContainerPoint([
      report.latitude,
      report.longitude,
    ]);
    const key = `${Math.floor(point.x / GRID)}:${Math.floor(point.y / GRID)}`;
    const bucket = buckets.get(key) ?? { items: [], sumX: 0, sumY: 0 };
    bucket.items.push(report);
    bucket.sumX += point.x;
    bucket.sumY += point.y;
    buckets.set(key, bucket);
  }

  const elements: React.ReactNode[] = [];

  for (const [key, bucket] of buckets) {
    if (bucket.items.length === 1) {
      const report = bucket.items[0];
      elements.push(
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={categoryPin(getCategoryColor(categories, report.categoryId))}
        >
          <Popup>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-900">
                {report.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={report.status} />
                <PriorityBadge priority={report.priority} />
              </div>
              <p className="text-xs text-slate-600">
                {getCategoryName(categories, report.categoryId)} ·{" "}
                {formatReportDate(report.createdAt)}
              </p>
              <p className="line-clamp-3 text-xs text-slate-600">
                {report.description}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectReport(report)}
                  className="text-xs font-medium text-green-700 hover:underline"
                >
                  Ver detalle
                </button>
                <Link
                  href={`/reports?focus=${report.id}`}
                  className="text-xs font-medium text-slate-500 hover:underline"
                >
                  Ir a reportes →
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    } else {
      const cx = bucket.sumX / bucket.items.length;
      const cy = bucket.sumY / bucket.items.length;
      const center = map.containerPointToLatLng([cx, cy]);

      elements.push(
        <Marker
          key={key}
          position={[center.lat, center.lng]}
          icon={clusterPin(bucket.items.length)}
          eventHandlers={{
            click: () => {
              map.setView(
                [center.lat, center.lng],
                Math.min(map.getZoom() + 2, 18)
              );
            },
          }}
        />
      );
    }
  }

  return <>{elements}</>;
}

// Capa de "zonas críticas": densidad ponderada por el impactFactor.
function HeatLayer({
  reports,
  categories,
}: {
  reports: Report[];
  categories: Category[];
}) {
  const map = useMap();
  const [tick, setTick] = useState(0);

  useMapEvents({
    moveend: () => setTick((t) => t + 1),
    zoomend: () => setTick((t) => t + 1),
  });

  useEffect(() => {
    setTick((t) => t + 1);
  }, []);

  void tick;

  const GRID = 44;
  const buckets = new Map<
    string,
    { weight: number; sumX: number; sumY: number; count: number }
  >();
  let maxWeight = 0;

  for (const report of reports) {
    const point = map.latLngToContainerPoint([
      report.latitude,
      report.longitude,
    ]);
    const key = `${Math.floor(point.x / GRID)}:${Math.floor(point.y / GRID)}`;
    const bucket = buckets.get(key) ?? {
      weight: 0,
      sumX: 0,
      sumY: 0,
      count: 0,
    };
    bucket.weight += impactWeight(report, categories);
    bucket.sumX += point.x;
    bucket.sumY += point.y;
    bucket.count += 1;
    buckets.set(key, bucket);
    maxWeight = Math.max(maxWeight, bucket.weight);
  }

  const elements: React.ReactNode[] = [];

  for (const [key, bucket] of buckets) {
    const cx = bucket.sumX / bucket.count;
    const cy = bucket.sumY / bucket.count;
    const center = map.containerPointToLatLng([cx, cy]);
    const ratio = maxWeight > 0 ? bucket.weight / maxWeight : 0;
    const radius = 18 + ratio * 42;
    const color = heatColor(ratio);

    elements.push(
      <CircleMarker
        key={key}
        center={[center.lat, center.lng]}
        radius={radius}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.2 + ratio * 0.4,
          weight: 0,
        }}
      />
    );
  }

  return <>{elements}</>;
}

const OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const SAT_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SAT_ATTR = "Tiles &copy; Esri — Source: Esri, Earthstar Geographics";

export default function EnvironmentalMap({
  reports,
  categories,
  viewMode,
  baseLayer,
  focusCoords,
  fitKey,
  onSelectReport,
}: EnvironmentalMapProps) {
  const center = getMapCenter(reports);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        key={baseLayer}
        attribution={baseLayer === "satellite" ? SAT_ATTR : OSM_ATTR}
        url={baseLayer === "satellite" ? SAT_URL : OSM_URL}
      />

      <FitBounds reports={reports} fitKey={fitKey} />
      <FocusController coords={focusCoords} />

      {viewMode === "markers" ? (
        <ClusterLayer
          reports={reports}
          categories={categories}
          onSelectReport={onSelectReport}
        />
      ) : (
        <HeatLayer reports={reports} categories={categories} />
      )}
    </MapContainer>
  );
}
