import type { ReportStatus } from "./report";

export interface StatusLog {
  id: string;
  reportId: string;
  previousStatus: ReportStatus;
  newStatus: ReportStatus;
  changedAt: string;
}