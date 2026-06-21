import { db } from "@/db/database";
import type { Report, ReportPriority, ReportStatus } from "@/types";

export interface CreateReportInput {
  userId: string;
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

export async function getAllReports(): Promise<Report[]> {
  return db.reports.orderBy("createdAt").reverse().toArray();
}

export async function getReportById(id: string): Promise<Report | undefined> {
  return db.reports.get(id);
}

export async function getReportsByUser(userId: string): Promise<Report[]> {
  return db.reports.where("userId").equals(userId).toArray();
}

export async function getReportsByCategory(categoryId: string): Promise<Report[]> {
  return db.reports.where("categoryId").equals(categoryId).toArray();
}

export async function getReportsByStatus(status: ReportStatus): Promise<Report[]> {
  return db.reports.where("status").equals(status).toArray();
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const now = new Date().toISOString();

  const report: Report = {
    id: crypto.randomUUID(),
    userId: input.userId,
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    status: input.status ?? "pending",
    priority: input.priority,
    latitude: input.latitude,
    longitude: input.longitude,
    image: input.image,
    createdAt: now,
    updatedAt: now,
  };

  await db.reports.add(report);

  return report;
}

export async function updateReport(
  id: string,
  input: UpdateReportInput
): Promise<void> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  await db.reports.update(id, {
    ...input,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateReportStatus(
  id: string,
  newStatus: ReportStatus
): Promise<void> {
  const existingReport = await db.reports.get(id);

  if (!existingReport) {
    throw new Error("El reporte no existe.");
  }

  await db.transaction("rw", db.reports, db.statusLogs, async () => {
    await db.reports.update(id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    await db.statusLogs.add({
      id: crypto.randomUUID(),
      reportId: id,
      previousStatus: existingReport.status,
      newStatus,
      changedAt: new Date().toISOString(),
    });
  });
}

export async function deleteReport(id: string): Promise<void> {
  await db.transaction("rw", db.reports, db.statusLogs, async () => {
    await db.reports.delete(id);
    await db.statusLogs.where("reportId").equals(id).delete();
  });
}

export async function clearReports(): Promise<void> {
  await db.transaction("rw", db.reports, db.statusLogs, async () => {
    await db.reports.clear();
    await db.statusLogs.clear();
  });
}