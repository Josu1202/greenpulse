import type { Category, Report, ReportPriority, ReportStatus } from "@/types";

// Las variantes coinciden exactamente con src/components/ui/Badge.tsx
type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pendiente",
  in_review: "En revisión",
  resolved: "Resuelto",
};

const STATUS_VARIANTS: Record<ReportStatus, BadgeVariant> = {
  pending: "warning",
  in_review: "info",
  resolved: "success",
};

const PRIORITY_LABELS: Record<ReportPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const PRIORITY_VARIANTS: Record<ReportPriority, BadgeVariant> = {
  low: "outline",
  medium: "warning",
  high: "danger",
};

export function getStatusLabel(status: ReportStatus): string {
  return STATUS_LABELS[status];
}

export function getStatusVariant(status: ReportStatus): BadgeVariant {
  return STATUS_VARIANTS[status];
}

export function getPriorityLabel(priority: ReportPriority): string {
  return PRIORITY_LABELS[priority];
}

export function getPriorityVariant(priority: ReportPriority): BadgeVariant {
  return PRIORITY_VARIANTS[priority];
}

export function getCategoryName(
  categories: Category[],
  categoryId: string
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Sin categoría";
}

export function getCategoryColor(
  categories: Category[],
  categoryId: string
): string {
  return categories.find((c) => c.id === categoryId)?.color ?? "#94a3b8";
}

export function formatReportDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// El hook useReports ya filtra por estado y categoría.
// La prioridad se aplica aquí, en la capa de features, sin modificar el hook de Persona 2.
export function filterReportsByPriority(
  reports: Report[],
  priority: ReportPriority | "all"
): Report[] {
  if (priority === "all") {
    return reports;
  }

  return reports.filter((report) => report.priority === priority);
}

/* ------------------------------------------------------------------ */
/* Búsqueda por texto (título y descripción)                           */
/* ------------------------------------------------------------------ */

// Normaliza texto para comparar sin distinguir mayúsculas ni acentos.
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function searchReports(reports: Report[], query: string): Report[] {
  const consulta = normalizarTexto(query);

  if (!consulta) {
    return reports;
  }

  return reports.filter((report) => {
    const titulo = normalizarTexto(report.title);
    const descripcion = normalizarTexto(report.description);

    return titulo.includes(consulta) || descripcion.includes(consulta);
  });
}

/* ------------------------------------------------------------------ */
/* Ordenamiento                                                        */
/* ------------------------------------------------------------------ */

export type ReportSortOption = "recent" | "oldest" | "priority" | "status";

export const REPORT_SORT_OPTIONS: { value: ReportSortOption; label: string }[] =
  [
    { value: "recent", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "priority", label: "Prioridad (alta → baja)" },
    { value: "status", label: "Estado (pendiente → resuelto)" },
  ];

const PRIORITY_ORDER: Record<ReportPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const STATUS_ORDER: Record<ReportStatus, number> = {
  pending: 0,
  in_review: 1,
  resolved: 2,
};

function fechaCreacion(report: Report): number {
  const t = new Date(report.createdAt).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function sortReports(
  reports: Report[],
  option: ReportSortOption
): Report[] {
  const copia = [...reports];

  switch (option) {
    case "oldest":
      return copia.sort((a, b) => fechaCreacion(a) - fechaCreacion(b));

    case "priority":
      return copia.sort(
        (a, b) =>
          PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
          fechaCreacion(b) - fechaCreacion(a)
      );

    case "status":
      return copia.sort(
        (a, b) =>
          STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
          fechaCreacion(b) - fechaCreacion(a)
      );

    case "recent":
    default:
      return copia.sort((a, b) => fechaCreacion(b) - fechaCreacion(a));
  }
}
