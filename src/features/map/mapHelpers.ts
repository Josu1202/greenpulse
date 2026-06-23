import type { Report } from "@/types";
import { DEFAULT_MAP_CENTER } from "@/utils/constants";

// Verifica que un reporte tenga coordenadas válidas para mostrarse en el mapa.
export function hasValidCoordinates(report: Report): boolean {
  return (
    Number.isFinite(report.latitude) &&
    Number.isFinite(report.longitude) &&
    report.latitude >= -90 &&
    report.latitude <= 90 &&
    report.longitude >= -180 &&
    report.longitude <= 180
  );
}

// Filtra solo los reportes que pueden ubicarse en el mapa.
export function getReportsWithCoordinates(reports: Report[]): Report[] {
  return reports.filter(hasValidCoordinates);
}

// Calcula el centro inicial del mapa: promedio de los reportes visibles,
// o el centro por defecto definido en constants.ts si no hay reportes.
export function getMapCenter(reports: Report[]): { lat: number; lng: number } {
  const valid = getReportsWithCoordinates(reports);

  if (valid.length === 0) {
    return DEFAULT_MAP_CENTER;
  }

  const lat = valid.reduce((sum, r) => sum + r.latitude, 0) / valid.length;
  const lng = valid.reduce((sum, r) => sum + r.longitude, 0) / valid.length;

  return { lat, lng };
}
