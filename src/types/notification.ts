export type NotificationType =
  | "report_created"
  | "report_high_priority"
  | "report_comment"
  | "report_progress"
  | "report_closed_by_admin"
  | "report_reopened_by_admin"
  | "report_reopened"
  | "report_hidden"
  | "report_restored"
  | "report_deleted"
  | "lesson_submitted"
  | "lesson_published"
  | "lesson_hidden"
  | "lesson_featured"
  | "lesson_unfeatured"
  | "lesson_deleted"
  | "badge_earned";

export type NotificationEntityType = "report" | "lesson" | "badge";

export interface AppNotification {
  id: string;
  recipientUserId: string;
  actorUserId?: string;
  actorName?: string;
  actorProfileImage?: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}
