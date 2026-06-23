import type { Category, Report } from "@/types";
import {
  formatReportDate,
  getCategoryName,
  getPriorityLabel,
  getStatusLabel,
} from "./reportPresentation";

// Escapa un valor para CSV: lo envuelve en comillas y duplica las internas.
function escaparCsv(valor: string): string {
  const texto = valor.replace(/"/g, '""');
  return `"${texto}"`;
}

// Genera el contenido CSV de una lista de reportes.
// Incluye BOM (\uFEFF) para que Excel reconozca el UTF-8 (acentos correctos).
export function reportsToCsv(
  reports: Report[],
  categories: Category[]
): string {
  const encabezados = [
    "ID",
    "Título",
    "Descripción",
    "Categoría",
    "Estado",
    "Prioridad",
    "Latitud",
    "Longitud",
    "Creado",
    "Actualizado",
  ];

  const filas = reports.map((report) => [
    report.id,
    report.title,
    report.description,
    getCategoryName(categories, report.categoryId),
    getStatusLabel(report.status),
    getPriorityLabel(report.priority),
    String(report.latitude),
    String(report.longitude),
    formatReportDate(report.createdAt),
    formatReportDate(report.updatedAt),
  ]);

  const lineas = [encabezados, ...filas].map((columnas) =>
    columnas.map((valor) => escaparCsv(String(valor))).join(",")
  );

  return "\uFEFF" + lineas.join("\r\n");
}

// Dispara la descarga de un archivo CSV en el navegador.
export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Nombre de archivo con fecha: reportes-greenpulse-2026-06-22.csv
export function buildReportsFilename(): string {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");

  return `reportes-greenpulse-${year}-${month}-${day}.csv`;
}
