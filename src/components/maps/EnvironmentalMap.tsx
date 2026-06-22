"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";

import type { Category, Report } from "@/types";
import {
  formatReportDate,
  getCategoryColor,
  getCategoryName,
} from "@/features/reports/reportPresentation";
import { PriorityBadge, StatusBadge } from "@/components/reports";
import { getMapCenter } from "@/features/map/mapHelpers";

interface EnvironmentalMapProps {
  reports: Report[];
  categories: Category[];
}

// Marcador como punto de color (divIcon) para evitar el problema clásico
// de los íconos de Leaflet rotos por el bundler, y para colorear por categoría.
function createPinIcon(color: string) {
  return L.divIcon({
    className: "greenpulse-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 1.5px rgba(15,23,42,0.25)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

export default function EnvironmentalMap({
  reports,
  categories,
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={createPinIcon(getCategoryColor(categories, report.categoryId))}
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

              <Link
                href={`/reports/new?id=${report.id}`}
                className="text-xs font-medium text-green-700 hover:underline"
              >
                Ver / editar reporte →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
