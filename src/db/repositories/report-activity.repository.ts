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
  const activities = await db.reportActivities
    .where("reportId")
    .equals(reportId)
    .sortBy("createdAt");

  return activities.filter((activity) => activity.isHidden !== true);
}

export async function getAllReportActivities(): Promise<ReportActivity[]> {
  const activities = await db.reportActivities.orderBy("createdAt").reverse().toArray();

  return activities.filter((activity) => activity.isHidden !== true);
}

export async function getAllReportActivitiesForAdmin(): Promise<ReportActivity[]> {
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
    isHidden: false,
    createdAt: new Date().toISOString(),
  };

  await db.reportActivities.add(activity);

  return activity;
}

export async function hideReportActivity(
  id: string,
  hiddenBy: string,
  hiddenReason?: string
): Promise<void> {
  const activity = await db.reportActivities.get(id);

  if (!activity) {
    throw new Error("La actividad no existe.");
  }

  await db.reportActivities.update(id, {
    isHidden: true,
    hiddenBy,
    hiddenReason: hiddenReason?.trim() || "Ocultado por administración.",
    hiddenAt: new Date().toISOString(),
  } as Partial<ReportActivity>);
}

export async function restoreReportActivity(id: string): Promise<void> {
  const activity = await db.reportActivities.get(id);

  if (!activity) {
    throw new Error("La actividad no existe.");
  }

  await db.reportActivities.update(id, {
    isHidden: false,
    hiddenBy: undefined,
    hiddenReason: undefined,
    hiddenAt: undefined,
  } as Partial<ReportActivity>);
}

export async function deleteReportActivity(id: string): Promise<void> {
  const activity = await db.reportActivities.get(id);

  if (!activity) {
    throw new Error("La actividad no existe.");
  }

  await db.reportActivities.delete(id);
}

export async function deleteActivitiesByReport(reportId: string): Promise<void> {
  await db.reportActivities.where("reportId").equals(reportId).delete();
}

export async function clearReportActivities(): Promise<void> {
  await db.reportActivities.clear();
}
