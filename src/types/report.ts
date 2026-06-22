export type ReportStatus = "pending" | "in_review" | "resolved";

export type ReportPriority = "low" | "medium" | "high";

export interface Report {
  id: string;
  userId: string;
  title: string;
  description: string;
  categoryId: string;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number;
  longitude: number;
  image?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}