import type { ReportPriority, ReportStatus } from "./report";

export type ReportActivityType = "comment" | "progress_update";

export interface ReportActivity {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  type: ReportActivityType;
  comment: string;
  image?: string;
  previousStatus?: ReportStatus;
  newStatus?: ReportStatus;
  previousPriority?: ReportPriority;
  newPriority?: ReportPriority;
  createdAt: string;
}
