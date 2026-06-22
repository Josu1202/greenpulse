import { db } from "@/db/database";
import type { ReportActivity, ReportActivityType } from "@/types";

export interface CreateReportActivityInput {
  reportId: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  type: ReportActivityType;
  comment: string;
  image?: string;
  previousStatus?: ReportActivity["previousStatus"];
  newStatus?: ReportActivity["newStatus"];
  previousPriority?: ReportActivity["previousPriority"];
  newPriority?: ReportActivity["newPriority"];
}

function normalizeComment(comment: string): string {
  return comment.trim();
}

export async function getActivitiesByReport(
  reportId: string
): Promise<ReportActivity[]> {
  return db.reportActivities
    .where("reportId")
    .equals(reportId)
    .sortBy("createdAt");
}

// Todas las actividades del sistema, de la más reciente a la más antigua.
// Se usa en el dashboard para construir el feed de actividad reciente real.
export async function getAllReportActivities(): Promise<ReportActivity[]> {
  return db.reportActivities.orderBy("createdAt").reverse().toArray();
}

export async function createReportActivity(
  input: CreateReportActivityInput
): Promise<ReportActivity> {
  const comment = normalizeComment(input.comment);

  if (!comment) {
    throw new Error("El comentario del historial es obligatorio.");
  }

  const activity: ReportActivity = {
    id: crypto.randomUUID(),
    reportId: input.reportId,
    userId: input.userId,
    userName: input.userName,
    userProfileImage: input.userProfileImage,
    type: input.type,
    comment,
    image: input.image,
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    previousPriority: input.previousPriority,
    newPriority: input.newPriority,
    createdAt: new Date().toISOString(),
  };

  await db.reportActivities.add(activity);

  return activity;
}

export async function deleteActivitiesByReport(reportId: string): Promise<void> {
  await db.reportActivities.where("reportId").equals(reportId).delete();
}

export async function clearReportActivities(): Promise<void> {
  await db.reportActivities.clear();
}
