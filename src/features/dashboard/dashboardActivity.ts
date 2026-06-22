import type {
  Category,
  Report,
  ReportActivity,
  ReportStatus,
} from "@/types";
import {
  getPriorityLabel,
  getStatusLabel,
} from "@/features/reports/reportPresentation";

export type DashboardEventKind =
  | "created"
  | "comment"
  | "status"
  | "priority"
  | "progress";

export interface DashboardEvent {
  id: string;
  reportId: string;
  reportTitle: string;
  categoryName: string;
  categoryColor: string;
  userName: string;
  userProfileImage?: string;
  kind: DashboardEventKind;
  description: string;
  newStatus?: ReportStatus;
  createdAt: string;
}

const CREATION_COMMENT = "Creó el reporte ambiental.";

function recortar(texto: string, max = 90): string {
  const limpio = texto.trim();
  return limpio.length > max ? `${limpio.slice(0, max - 1)}…` : limpio;
}

// Convierte una actividad cruda en un evento legible para el dashboard.
function describirActividad(activity: ReportActivity): {
  kind: DashboardEventKind;
  description: string;
} {
  if (activity.type === "comment") {
    return {
      kind: "comment",
      description: `Comentó: "${recortar(activity.comment)}"`,
    };
  }

  // type === "progress_update"
  const esCreacion =
    activity.previousStatus === undefined &&
    activity.previousPriority === undefined;

  if (esCreacion || activity.comment === CREATION_COMMENT) {
    return { kind: "created", description: "Creó el reporte" };
  }

  const cambioEstado =
    activity.newStatus !== undefined &&
    activity.previousStatus !== undefined &&
    activity.newStatus !== activity.previousStatus;

  if (cambioEstado && activity.newStatus) {
    return {
      kind: "status",
      description: `Cambió el estado a ${getStatusLabel(activity.newStatus)}`,
    };
  }

  const cambioPrioridad =
    activity.newPriority !== undefined &&
    activity.previousPriority !== undefined &&
    activity.newPriority !== activity.previousPriority;

  if (cambioPrioridad && activity.newPriority) {
    return {
      kind: "priority",
      description: `Cambió la prioridad a ${getPriorityLabel(
        activity.newPriority
      )}`,
    };
  }

  return {
    kind: "progress",
    description: `Registró un avance: "${recortar(activity.comment)}"`,
  };
}

// Construye el feed de actividad reciente real combinando las actividades
// (creación, comentarios, cambios de estado/prioridad y avances) con los
// datos de cada reporte y su categoría.
export function construirActividad(
  activities: ReportActivity[],
  reports: Report[],
  categories: Category[],
  limit = 8
): DashboardEvent[] {
  const reportById = new Map(reports.map((report) => [report.id, report]));
  const categoryById = new Map(
    categories.map((category) => [category.id, category])
  );

  const eventos: DashboardEvent[] = [];

  for (const activity of activities) {
    const report = reportById.get(activity.reportId);

    if (!report) {
      // El reporte fue eliminado: omitimos su actividad huérfana.
      continue;
    }

    const category = categoryById.get(report.categoryId);
    const { kind, description } = describirActividad(activity);

    eventos.push({
      id: activity.id,
      reportId: activity.reportId,
      reportTitle: report.title,
      categoryName: category?.name ?? "Sin categoría",
      categoryColor: category?.color ?? "#94a3b8",
      userName: activity.userName,
      userProfileImage: activity.userProfileImage,
      kind,
      description,
      newStatus: activity.newStatus,
      createdAt: activity.createdAt,
    });
  }

  return eventos
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
