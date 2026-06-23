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
