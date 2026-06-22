import { db } from "@/db/database";
import type { StatusLog } from "@/types";

export async function getAllStatusLogs(): Promise<StatusLog[]> {
  return db.statusLogs.orderBy("changedAt").reverse().toArray();
}

export async function getStatusLogById(
  id: string
): Promise<StatusLog | undefined> {
  return db.statusLogs.get(id);
}

export async function getStatusLogsByReport(
  reportId: string
): Promise<StatusLog[]> {
  const logs = await db.statusLogs
    .where("reportId")
    .equals(reportId)
    .sortBy("changedAt");

  return logs.reverse();
}

export async function createStatusLog(statusLog: StatusLog): Promise<string> {
  await db.statusLogs.add(statusLog);
  return statusLog.id;
}

export async function deleteStatusLog(id: string): Promise<void> {
  await db.statusLogs.delete(id);
}

export async function deleteStatusLogsByReport(reportId: string): Promise<void> {
  await db.statusLogs.where("reportId").equals(reportId).delete();
}

export async function clearStatusLogs(): Promise<void> {
  await db.statusLogs.clear();
}