import type { Category, Report } from "@/types";
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

// Límites [ [sur, oeste], [norte, este] ] que contienen todos los reportes.
// Devuelve null si no hay reportes con coordenadas válidas.
export function getReportsBounds(
  reports: Report[]
): [[number, number], [number, number]] | null {
  const valid = getReportsWithCoordinates(reports);

  if (valid.length === 0) {
    return null;
  }

  let minLat = valid[0].latitude;
  let maxLat = valid[0].latitude;
  let minLng = valid[0].longitude;
  let maxLng = valid[0].longitude;

  for (const report of valid) {
    minLat = Math.min(minLat, report.latitude);
    maxLat = Math.max(maxLat, report.latitude);
    minLng = Math.min(minLng, report.longitude);
    maxLng = Math.max(maxLng, report.longitude);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

// Filtro de texto local (título/descripción), sin acentos ni mayúsculas.
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function filterReportsByText(
  reports: Report[],
  query: string
): Report[] {
  const consulta = normalizar(query);

  if (!consulta) {
    return reports;
  }

  return reports.filter(
    (report) =>
      normalizar(report.title).includes(consulta) ||
      normalizar(report.description).includes(consulta)
  );
}

// Peso de impacto de un reporte según el impactFactor de su categoría.
export function impactWeight(
  report: Report,
  categories: Category[]
): number {
  return categories.find((c) => c.id === report.categoryId)?.impactFactor ?? 1;
}
