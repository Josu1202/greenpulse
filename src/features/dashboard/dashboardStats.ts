import type { Category, Report } from "@/types";

export interface DashboardKpis {
  total: number;
  pendientes: number;
  enRevision: number;
  resueltos: number;
}

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

// Indicadores numéricos principales (tarjetas KPI).
export function calcularKpis(reports: Report[]): DashboardKpis {
  return {
    total: reports.length,
    pendientes: reports.filter((r) => r.status === "pending").length,
    enRevision: reports.filter((r) => r.status === "in_review").length,
    resueltos: reports.filter((r) => r.status === "resolved").length,
  };
}

// Reportes agrupados por categoría (para gráfica de dona).
// Usa el color real definido en cada categoría (DEFAULT_CATEGORIES).
export function reportesPorCategoria(
  reports: Report[],
  categories: Category[]
): ChartDatum[] {
  return categories
    .map((category) => ({
      name: category.name,
      value: reports.filter((r) => r.categoryId === category.id).length,
      color: category.color,
    }))
    .filter((datum) => datum.value > 0);
}

// Reportes agrupados por estado (para gráfica de barras).
export function reportesPorEstado(reports: Report[]): ChartDatum[] {
  return [
    {
      name: "Pendiente",
      value: reports.filter((r) => r.status === "pending").length,
      color: "#f59e0b",
    },
    {
      name: "En revisión",
      value: reports.filter((r) => r.status === "in_review").length,
      color: "#0ea5e9",
    },
    {
      name: "Resuelto",
      value: reports.filter((r) => r.status === "resolved").length,
      color: "#22c55e",
    },
  ];
}

// Reportes agrupados por prioridad (opcional, para gráfica de barras).
export function reportesPorPrioridad(reports: Report[]): ChartDatum[] {
  return [
    {
      name: "Alta",
      value: reports.filter((r) => r.priority === "high").length,
      color: "#ef4444",
    },
    {
      name: "Media",
      value: reports.filter((r) => r.priority === "medium").length,
      color: "#f59e0b",
    },
    {
      name: "Baja",
      value: reports.filter((r) => r.priority === "low").length,
      color: "#94a3b8",
    },
  ];
}

// Últimos reportes creados, ordenados del más reciente al más antiguo.
export function actividadReciente(reports: Report[], limit = 5): Report[] {
  return [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
