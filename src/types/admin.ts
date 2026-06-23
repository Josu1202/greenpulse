export type AdminEventType =
  | "login"
  | "page_view"
  | "report_updated"
  | "report_hidden"
  | "report_restored"
  | "report_deleted"
  | "activity_hidden"
  | "activity_restored"
  | "activity_deleted"
  | "lesson_created"
  | "lesson_updated"
  | "lesson_published"
  | "lesson_hidden"
  | "lesson_deleted"
  | "lesson_viewed"
  | "recognition_used"
  | "user_deactivated"
  | "user_reactivated";

export type AdminEventEntityType =
  | "user"
  | "report"
  | "report_activity"
  | "lesson"
  | "page"
  | "recognition";

export interface AdminEvent {
  id: string;
  userId?: string;
  userName?: string;
  type: AdminEventType;
  path?: string;
  entityId?: string;
  entityType?: AdminEventEntityType;
  description?: string;
  createdAt: string;
}

export interface AdminChartDatum {
  name: string;
  value: number;
  color?: string;
}

export interface AdminRecentEvent {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersLast7Days: number;
  averageReportsPerUser: number;
  averageActivitiesPerUser: number;

  totalReports: number;
  visibleReportsCount: number;
  hiddenReportsCount: number;
  pendingReportsCount: number;
  inReviewReportsCount: number;
  resolvedReportsCount: number;
  highPriorityReportsCount: number;
  reportResolutionRate: number;
  averageActivitiesPerReport: number;

  totalActivities: number;
  commentsCount: number;
  progressUpdatesCount: number;

  totalLessonsCount: number;
  baseLessonsCount: number;
  userLessonsCount: number;
  pendingReviewLessonsCount: number;
  publishedLessonsCount: number;
  hiddenLessonsCount: number;
  featuredLessonsCount: number;
  completedLessonsCount: number;
  lessonCompletionCoverageRate: number;

  pageViewsCount: number;
  recognitionViewsCount: number;
  adminViewsCount: number;

  userStatusChart: AdminChartDatum[];
  userContributionChart: AdminChartDatum[];
  reportStatusChart: AdminChartDatum[];
  reportPriorityChart: AdminChartDatum[];
  reportVisibilityChart: AdminChartDatum[];
  reportCategoryChart: AdminChartDatum[];
  forumActivityChart: AdminChartDatum[];
  lessonStatusChart: AdminChartDatum[];
  lessonSourceChart: AdminChartDatum[];
  topCompletedLessons: AdminChartDatum[];
  pageViewsChart: AdminChartDatum[];
  recentEvents: AdminRecentEvent[];
}
