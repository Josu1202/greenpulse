import { db } from "@/db/database";
import type {
  Report,
  ReportActivity,
  ReportPriority,
  ReportStatus,
} from "@/types";
import { createReportActivity } from "./report-activity.repository";

export interface ReportActorInput {
  userId: string;
  userName: string;
  userProfileImage?: string;
}

export interface CreateReportInput extends ReportActorInput {
  title: string;
  description: string;
  categoryId: string;
  priority: ReportPriority;
  latitude: number;
  longitude: number;
  image?: string;
  status?: ReportStatus;
}

export interface UpdateReportInput {
  title?: string;
  description?: string;
  categoryId?: string;
  status?: ReportStatus;
  priority?: ReportPriority;
  latitude?: number;
  longitude?: number;
  image?: string;
}

export interface AddReportCommentInput extends ReportActorInput {
  reportId: string;
  comment: string;
  image?: string;
}

export interface AddReportProgressInput extends ReportActorInput {
  reportId: string;
  comment: string;
  status: ReportStatus;
  priority: ReportPriority;
  image?: string;
}

function normalizeText(value: string): string {
  return value.trim();
}

function validateReportBase(input: {
  title?: string;
  description?: string;
  categoryId?: string;
}): void {
  if (input.title !== undefined && !normalizeText(input.title)) {
    throw new Error("El título del reporte es obligatorio.");
  }

  if (input.description !== undefined && !normalizeText(input.description)) {
    throw new Error("La descripción del reporte es obligatoria.");
  }

  if (input.categoryId !== undefined && !normalizeText(input.categoryId)) {
    throw new Error("La categoría del reporte es obligatoria.");
  }
}

function validateCoordinates(latitude: number, longitude: number): void {
  if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Debe seleccionar una latitud válida.");
  }

  if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Debe seleccionar una longitud válida.");
  }
}

function ensureReportOwner(report: Report, actorUserId: string): void {
  if (report.userId !== actorUserId) {
    throw new Error("Solo el dueño del reporte puede modificar esta información.");
  }
}

function ensureReportOpen(report: Report): void {
  if (report.status === "resolved") {
    throw new Error(
      "El reporte está completado. El autor debe reabrirlo antes de permitir nuevos cambios o avances."
    );
  }
}

function hasOriginalContentChanges(
  existingReport: Report,
  changes: Partial<Report>
): boolean {
  return Boolean(
    (changes.title !== undefined && changes.title !== existingReport.title) ||
      (changes.description !== undefined &&
        changes.description !== existingReport.description) ||
      (changes.categoryId !== undefined &&
        changes.categoryId !== existingReport.categoryId) ||
      (changes.latitude !== undefined &&
        changes.latitude !== existingReport.latitude) ||
      (changes.longitude !== undefined &&
        changes.longitude !== existingReport.longitude)
  );
}

function hasImageChange(existingReport: Report, changes: Partial<Report>): boolean {
  return changes.image !== undefined && changes.image !== existingReport.image;
}

async function getUpdatedReport(id: string): Promise<Report> {
  const updatedReport = await db.reports.get(id);

  if (!updatedReport) {
    throw new Error("No se pudo recuperar el reporte actualizado.");
  }

  return updatedReport;
}

export async function getAllReports(): Promise<Report[]> {
  return db.reports.orderBy("createdAt").reverse().toArray();
}

export async function getReportById(id: string): Promise<Report | undefined> {
  return db.reports.get(id);
}

export async function getReportsByUser(userId: string): Promise<Report[]> {
  const reports = await db.reports
    .where("userId")
    .equals(userId)
    .sortBy("createdAt");

  return reports.reverse();
}

export async function getReportsByCategory(
  categoryId: string
): Promise<Report[]> {
  const reports = await db.reports
    .where("categoryId")
    .equals(categoryId)
    .sortBy("createdAt");

  return reports.reverse();
}

export async function getReportsByStatus(
  status: ReportStatus
): Promise<Report[]> {
  const reports = await db.reports
    .where("status")
    .equals(status)
    .sortBy("createdAt");

  return reports.reverse();
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const title = normalizeText(input.title);
  const description = normalizeText(input.description);
  const categoryId = normalizeText(input.categoryId);

  validateReportBase({ title, description, categoryId });
  validateCoordinates(input.latitude, input.longitude);

  if (!input.userId) {
    throw new Error("No se puede crear un reporte sin usuario.");
  }

  const now = new Date().toISOString();

  const report: Report = {
    id: crypto.randomUUID(),
    userId: input.userId,
    title,
    description,
    categoryId,
    status: input.status ?? "pending",
    priority: input.priority,
    latitude: input.latitude,
    longitude: input.longitude,
    image: input.image,
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction("rw", db.reports, db.reportActivities, async () => {
    await db.reports.add(report);

    await createReportActivity({
      reportId: report.id,
      userId: input.userId,
      userName: input.userName,
      userProfileImage: input.userProfileImage,
      type: "progress_update",
      comment: "Creó el reporte ambiental.",
      image: input.image,
      newStatus: report.status,
      newPriority: report.priority,
    });
  });

  return report;
}

export async function updateReport(
  id: string,
  input: UpdateReportInput,
  actor: ReportActorInput
): Promise<Report> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  ensureReportOwner(existingReport, actor.userId);
  ensureReportOpen(existingReport);
  validateReportBase(input);

  if (input.latitude !== undefined || input.longitude !== undefined) {
    validateCoordinates(
      input.latitude ?? existingReport.latitude,
      input.longitude ?? existingReport.longitude
    );
  }

  const changes: Partial<Report> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    changes.title = normalizeText(input.title);
  }

  if (input.description !== undefined) {
    changes.description = normalizeText(input.description);
  }

  if (input.categoryId !== undefined) {
    changes.categoryId = normalizeText(input.categoryId);
  }

  if (input.status !== undefined) {
    changes.status = input.status;
  }

  if (input.priority !== undefined) {
    changes.priority = input.priority;
  }

  if (input.latitude !== undefined) {
    changes.latitude = input.latitude;
  }

  if (input.longitude !== undefined) {
    changes.longitude = input.longitude;
  }

  if (input.image !== undefined) {
    changes.image = input.image;
  }

  await db.transaction(
    "rw",
    db.reports,
    db.statusLogs,
    db.reportActivities,
    async () => {
      await db.reports.update(id, changes);

      if (hasOriginalContentChanges(existingReport, changes)) {
        await createReportActivity({
          reportId: id,
          userId: actor.userId,
          userName: actor.userName,
          userProfileImage: actor.userProfileImage,
          type: "progress_update",
          comment: "Actualizó la información original del reporte.",
          previousStatus: existingReport.status,
          newStatus: changes.status ?? existingReport.status,
          previousPriority: existingReport.priority,
          newPriority: changes.priority ?? existingReport.priority,
        });
      }

      if (hasImageChange(existingReport, changes)) {
        await createReportActivity({
          reportId: id,
          userId: actor.userId,
          userName: actor.userName,
          userProfileImage: actor.userProfileImage,
          type: "progress_update",
          comment: "Actualizó la imagen principal del reporte.",
          image: changes.image,
          previousStatus: existingReport.status,
          newStatus: changes.status ?? existingReport.status,
          previousPriority: existingReport.priority,
          newPriority: changes.priority ?? existingReport.priority,
        });
      }

      if (input.status !== undefined && input.status !== existingReport.status) {
        await db.statusLogs.add({
          id: crypto.randomUUID(),
          reportId: id,
          previousStatus: existingReport.status,
          newStatus: input.status,
          changedAt: new Date().toISOString(),
        });
      }
    }
  );

  return getUpdatedReport(id);
}

export async function addReportComment(
  input: AddReportCommentInput
): Promise<ReportActivity> {
  const existingReport = await db.reports.get(input.reportId);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  ensureReportOpen(existingReport);

  const comment = normalizeText(input.comment);

  if (!comment) {
    throw new Error("El comentario es obligatorio.");
  }

  return createReportActivity({
    reportId: input.reportId,
    userId: input.userId,
    userName: input.userName,
    userProfileImage: input.userProfileImage,
    type: "comment",
    comment,
    image: input.image,
  });
}

export async function addReportProgressUpdate(
  input: AddReportProgressInput
): Promise<ReportActivity> {
  const existingReport = await db.reports.get(input.reportId);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  ensureReportOpen(existingReport);

  const comment = normalizeText(input.comment);

  if (!comment) {
    throw new Error("El avance debe incluir un comentario.");
  }

  let activity: ReportActivity | undefined;
  const updatedAt = new Date().toISOString();

  await db.transaction(
    "rw",
    db.reports,
    db.statusLogs,
    db.reportActivities,
    async () => {
      await db.reports.update(input.reportId, {
        status: input.status,
        priority: input.priority,
        updatedAt,
      });

      if (existingReport.status !== input.status) {
        await db.statusLogs.add({
          id: crypto.randomUUID(),
          reportId: input.reportId,
          previousStatus: existingReport.status,
          newStatus: input.status,
          changedAt: updatedAt,
        });
      }

      activity = await createReportActivity({
        reportId: input.reportId,
        userId: input.userId,
        userName: input.userName,
        userProfileImage: input.userProfileImage,
        type: "progress_update",
        comment,
        image: input.image,
        previousStatus: existingReport.status,
        newStatus: input.status,
        previousPriority: existingReport.priority,
        newPriority: input.priority,
      });
    }
  );

  if (!activity) {
    throw new Error("No se pudo registrar el avance.");
  }

  return activity;
}

export async function updateReportStatus(
  id: string,
  newStatus: ReportStatus,
  actor: ReportActorInput
): Promise<Report> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  if (existingReport.status === newStatus) {
    return existingReport;
  }

  if (existingReport.status === "resolved") {
    ensureReportOwner(existingReport, actor.userId);

    if (newStatus === "resolved") {
      return existingReport;
    }
  }

  const updatedAt = new Date().toISOString();
  const isReopen =
    existingReport.status === "resolved" && newStatus !== "resolved";

  await db.transaction(
    "rw",
    db.reports,
    db.statusLogs,
    db.reportActivities,
    async () => {
      await db.reports.update(id, {
        status: newStatus,
        updatedAt,
      });

      await db.statusLogs.add({
        id: crypto.randomUUID(),
        reportId: id,
        previousStatus: existingReport.status,
        newStatus,
        changedAt: updatedAt,
      });

      await createReportActivity({
        reportId: id,
        userId: actor.userId,
        userName: actor.userName,
        userProfileImage: actor.userProfileImage,
        type: "progress_update",
        comment: isReopen
          ? "Reabrió el reporte para permitir nuevos avances."
          : "Actualizó el estado del reporte.",
        previousStatus: existingReport.status,
        newStatus,
        previousPriority: existingReport.priority,
        newPriority: existingReport.priority,
      });
    }
  );

  return getUpdatedReport(id);
}

export async function updateReportPriority(
  id: string,
  newPriority: ReportPriority,
  actor: ReportActorInput
): Promise<Report> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  ensureReportOpen(existingReport);

  if (existingReport.priority === newPriority) {
    return existingReport;
  }

  await db.transaction("rw", db.reports, db.reportActivities, async () => {
    await db.reports.update(id, {
      priority: newPriority,
      updatedAt: new Date().toISOString(),
    });

    await createReportActivity({
      reportId: id,
      userId: actor.userId,
      userName: actor.userName,
      userProfileImage: actor.userProfileImage,
      type: "progress_update",
      comment: "Actualizó la prioridad del reporte.",
      previousStatus: existingReport.status,
      newStatus: existingReport.status,
      previousPriority: existingReport.priority,
      newPriority,
    });
  });

  return getUpdatedReport(id);
}

export async function deleteReport(
  id: string,
  actorUserId: string
): Promise<void> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  ensureReportOwner(existingReport, actorUserId);
  ensureReportOpen(existingReport);

  await db.transaction(
    "rw",
    db.reports,
    db.statusLogs,
    db.reportActivities,
    async () => {
      await db.statusLogs.where("reportId").equals(id).delete();
      await db.reportActivities.where("reportId").equals(id).delete();
      await db.reports.delete(id);
    }
  );
}

export async function clearReports(): Promise<void> {
  await db.transaction(
    "rw",
    db.reports,
    db.statusLogs,
    db.reportActivities,
    async () => {
      await db.statusLogs.clear();
      await db.reportActivities.clear();
      await db.reports.clear();
    }
  );
}
