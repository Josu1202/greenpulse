import { db } from "@/db/database";
import type {
  AdminChartDatum,
  AdminDashboardStats,
  AdminEvent,
  AdminRecentEvent,
  EducationLesson,
  EducationLessonStatus,
  Report,
  ReportActivity,
  User,
} from "@/types";

import {
  adminDeleteReport,
  adminHideReport,
  adminRestoreReport,
  adminUpdateReport,
  type AdminUpdateReportInput,
  type ReportActorInput,
} from "./report.repository";
import {
  deleteReportActivity,
  hideReportActivity,
  restoreReportActivity,
} from "./report-activity.repository";
import {
  adminCreateEducationLesson,
  adminDeleteEducationLesson,
  adminUpdateEducationLesson,
  getAllEducationLessonsForAdmin,
  getAllEducationProgress,
  type AdminCreateEducationLessonInput,
  type AdminUpdateEducationLessonInput,
} from "./education.repository";
import { setUserActiveStatus } from "./user.repository";
import { trackAdminEvent } from "./admin-event.repository";
import { createNotification } from "./notification.repository";

export interface AdminReportsData {
  reports: Report[];
  activities: ReportActivity[];
  users: User[];
}

export interface AdminLessonsData {
  lessons: EducationLesson[];
  completedByLesson: Record<string, number>;
}

export interface AdminUsersData {
  users: User[];
  reportsByUser: Record<string, number>;
  activitiesByUser: Record<string, number>;
  lessonsByUser: Record<string, number>;
  progressByUser: Record<string, number>;
}

function countBy<T>(items: T[], getKey: (item: T) => string | undefined): Record<string, number> {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = getKey(item);

    if (!key) {
      return accumulator;
    }

    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function isWithinLastDays(isoDate: string, days: number): boolean {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const limit = new Date();
  limit.setDate(limit.getDate() - days);

  return date >= limit;
}

function pathToSection(path?: string): string {
  if (!path) {
    return "Sin ruta";
  }

  if (path === "/dashboard" || path.startsWith("/dashboard")) {
    return "Dashboard";
  }

  if (path === "/reports" || path.startsWith("/reports")) {
    return "Reportes";
  }

  if (path === "/map" || path.startsWith("/map")) {
    return "Mapa";
  }

  if (path === "/education" || path.startsWith("/education")) {
    return "Educación";
  }

  if (path === "/recognition" || path.startsWith("/recognition")) {
    return "Reconocimiento IA";
  }

  if (path === "/admin" || path.startsWith("/admin")) {
    return "Admin";
  }

  return path;
}

function formatLessonStatus(status: EducationLessonStatus): string {
  const labels: Record<EducationLessonStatus, string> = {
    pending_review: "En revisión",
    published: "Publicadas",
    hidden: "Ocultas",
  };

  return labels[status];
}

function buildReportStatusChart(reports: Report[]): AdminChartDatum[] {
  return [
    { name: "Pendientes", value: reports.filter((report) => report.status === "pending").length },
    { name: "En revisión", value: reports.filter((report) => report.status === "in_review").length },
    { name: "Resueltos", value: reports.filter((report) => report.status === "resolved").length },
  ];
}

function buildReportPriorityChart(reports: Report[]): AdminChartDatum[] {
  return [
    { name: "Alta", value: reports.filter((report) => report.priority === "high").length },
    { name: "Media", value: reports.filter((report) => report.priority === "medium").length },
    { name: "Baja", value: reports.filter((report) => report.priority === "low").length },
  ];
}

function buildReportCategoryChart(
  reports: Report[],
  categoriesById: Record<string, string>
): AdminChartDatum[] {
  const counts = countBy(reports, (report) => categoriesById[report.categoryId] ?? "Sin categoría");

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildPageViewsChart(events: AdminEvent[]): AdminChartDatum[] {
  const pageViews = events.filter((event) => event.type === "page_view");
  const counts = countBy(pageViews, (event) => pathToSection(event.path));

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function buildTopLessonsChart(
  lessons: EducationLesson[],
  completedByLesson: Record<string, number>
): AdminChartDatum[] {
  return lessons
    .map((lesson) => ({
      name: lesson.title.length > 28 ? `${lesson.title.slice(0, 28)}...` : lesson.title,
      value: completedByLesson[lesson.id] ?? 0,
    }))
    .filter((datum) => datum.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function buildUserContributionChart(
  users: User[],
  reports: Report[],
  activities: ReportActivity[]
): AdminChartDatum[] {
  return users
    .filter((user) => user.role !== "admin")
    .map((user) => {
      const reportCount = reports.filter((report) => report.userId === user.id).length;
      const activityCount = activities.filter((activity) => activity.userId === user.id).length;

      return {
        name: user.name.length > 22 ? `${user.name.slice(0, 22)}...` : user.name,
        value: reportCount + activityCount,
      };
    })
    .filter((datum) => datum.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function buildRecentEvents(
  activities: ReportActivity[],
  lessons: EducationLesson[],
  users: User[]
): AdminRecentEvent[] {
  const activityEvents: AdminRecentEvent[] = activities.slice(0, 8).map((activity) => ({
    id: activity.id,
    title: activity.type === "comment" ? "Comentario en reporte" : "Avance en reporte",
    description: `${activity.userName}: ${activity.comment}`,
    createdAt: activity.createdAt,
    tone: activity.type === "comment" ? "info" : "success",
  }));

  const lessonEvents: AdminRecentEvent[] = lessons
    .filter((lesson) => lesson.source === "user")
    .slice(0, 6)
    .map((lesson) => ({
      id: lesson.id,
      title: "Lección creada por usuario",
      description: `${lesson.createdByUserName ?? "Usuario"}: ${lesson.title}`,
      createdAt: lesson.createdAt,
      tone: "warning",
    }));

  const userEvents: AdminRecentEvent[] = users.slice(0, 6).map((user) => ({
    id: user.id,
    title: "Usuario registrado",
    description: `${user.name} (${user.email})`,
    createdAt: user.createdAt,
    tone: "default",
  }));

  return [...activityEvents, ...lessonEvents, ...userEvents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 14);
}

function normalizeLessonStatus(lesson: EducationLesson): EducationLessonStatus {
  if (lesson.status) {
    return lesson.status;
  }

  return lesson.source === "base" ? "published" : "pending_review";
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [users, reports, activities, lessons, progress, events, categories] = await Promise.all([
    db.users.orderBy("createdAt").reverse().toArray(),
    db.reports.toArray(),
    db.reportActivities.orderBy("createdAt").reverse().toArray(),
    getAllEducationLessonsForAdmin(),
    getAllEducationProgress(),
    db.adminEvents.orderBy("createdAt").reverse().toArray(),
    db.categories.toArray(),
  ]);

  const normalizedLessons = lessons.map((lesson) => ({
    ...lesson,
    status: normalizeLessonStatus(lesson),
    isFeatured: lesson.isFeatured ?? false,
  }));

  const categoriesById = categories.reduce<Record<string, string>>((accumulator, category) => {
    accumulator[category.id] = category.name;
    return accumulator;
  }, {});

  const commentsCount = activities.filter((activity) => activity.type === "comment").length;
  const progressUpdatesCount = activities.filter(
    (activity) => activity.type === "progress_update"
  ).length;
  const completedByLesson = countBy(progress, (item) => item.lessonId);
  const pageViews = events.filter((event) => event.type === "page_view");
  const recognitionViewsCount = pageViews.filter((event) =>
    event.path?.startsWith("/recognition")
  ).length;
  const adminViewsCount = pageViews.filter((event) => event.path?.startsWith("/admin")).length;

  const totalReports = reports.length;
  const hiddenReportsCount = reports.filter((report) => report.isHidden).length;
  const visibleReportsCount = totalReports - hiddenReportsCount;
  const pendingReportsCount = reports.filter((report) => report.status === "pending").length;
  const inReviewReportsCount = reports.filter((report) => report.status === "in_review").length;
  const resolvedReportsCount = reports.filter((report) => report.status === "resolved").length;
  const highPriorityReportsCount = reports.filter((report) => report.priority === "high").length;

  const activeUsers = users.filter((user) => user.isActive !== false).length;
  const inactiveUsers = users.length - activeUsers;
  const studentUsers = users.filter((user) => user.role !== "admin");

  const pendingReviewLessonsCount = normalizedLessons.filter(
    (lesson) => lesson.status === "pending_review"
  ).length;
  const publishedLessonsCount = normalizedLessons.filter(
    (lesson) => lesson.status === "published"
  ).length;
  const hiddenLessonsCount = normalizedLessons.filter((lesson) => lesson.status === "hidden").length;
  const featuredLessonsCount = normalizedLessons.filter((lesson) => lesson.isFeatured).length;
  const userLessonsCount = normalizedLessons.filter((lesson) => lesson.source === "user").length;
  const baseLessonsCount = normalizedLessons.filter((lesson) => lesson.source === "base").length;

  return {
    totalUsers: users.length,
    activeUsers,
    inactiveUsers,
    newUsersLast7Days: users.filter((user) => isWithinLastDays(user.createdAt, 7)).length,
    averageReportsPerUser:
      studentUsers.length > 0 ? Number((reports.length / studentUsers.length).toFixed(1)) : 0,
    averageActivitiesPerUser:
      studentUsers.length > 0 ? Number((activities.length / studentUsers.length).toFixed(1)) : 0,

    totalActivities: activities.length,
    commentsCount,
    progressUpdatesCount,

    totalLessonsCount: normalizedLessons.length,
    baseLessonsCount,
    userLessonsCount,
    pendingReviewLessonsCount,
    publishedLessonsCount,
    hiddenLessonsCount,
    featuredLessonsCount,
    completedLessonsCount: progress.length,
    lessonCompletionCoverageRate:
      normalizedLessons.length > 0
        ? Math.round((Object.keys(completedByLesson).length / normalizedLessons.length) * 100)
        : 0,

    pageViewsCount: pageViews.length,
    recognitionViewsCount,
    adminViewsCount,
    averageActivitiesPerReport:
      reports.length > 0 ? Number((activities.length / reports.length).toFixed(1)) : 0,
    totalReports,
    visibleReportsCount,
    hiddenReportsCount,
    pendingReportsCount,
    inReviewReportsCount,
    resolvedReportsCount,
    highPriorityReportsCount,
    reportResolutionRate:
      totalReports > 0 ? Math.round((resolvedReportsCount / totalReports) * 100) : 0,

    userStatusChart: [
      { name: "Activos", value: activeUsers },
      { name: "Inactivos", value: inactiveUsers },
    ],
    userContributionChart: buildUserContributionChart(users, reports, activities),
    reportStatusChart: buildReportStatusChart(reports),
    reportPriorityChart: buildReportPriorityChart(reports),
    reportVisibilityChart: [
      { name: "Visibles", value: visibleReportsCount },
      { name: "Ocultos", value: hiddenReportsCount },
    ],
    reportCategoryChart: buildReportCategoryChart(reports, categoriesById),
    forumActivityChart: [
      { name: "Comentarios", value: commentsCount },
      { name: "Avances", value: progressUpdatesCount },
    ],
    lessonStatusChart: [
      { name: formatLessonStatus("pending_review"), value: pendingReviewLessonsCount },
      { name: formatLessonStatus("published"), value: publishedLessonsCount },
      { name: formatLessonStatus("hidden"), value: hiddenLessonsCount },
    ],
    lessonSourceChart: [
      { name: "Base GreenPulse", value: baseLessonsCount },
      { name: "Creadas por usuarios", value: userLessonsCount },
    ],
    topCompletedLessons: buildTopLessonsChart(normalizedLessons, completedByLesson),
    pageViewsChart: buildPageViewsChart(events),
    recentEvents: buildRecentEvents(activities, normalizedLessons, users),
  };
}

export async function getAdminReportsData(): Promise<AdminReportsData> {
  const [reports, activities, users] = await Promise.all([
    db.reports.orderBy("createdAt").reverse().toArray(),
    db.reportActivities.orderBy("createdAt").reverse().toArray(),
    db.users.orderBy("createdAt").reverse().toArray(),
  ]);

  return { reports, activities, users };
}

export async function updateReportAsAdmin(
  id: string,
  input: AdminUpdateReportInput,
  actor: ReportActorInput
): Promise<Report> {
  const previousReport = await db.reports.get(id);
  const report = await adminUpdateReport(id, input, actor);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "report_updated",
    entityId: id,
    entityType: "report",
    description: "Reporte actualizado por administración.",
  });

  if (previousReport && input.status && previousReport.status !== input.status) {
    if (input.status === "resolved") {
      await createNotification({
        recipientUserId: previousReport.userId,
        actorUserId: actor.userId,
        actorName: actor.userName,
        actorProfileImage: actor.userProfileImage,
        type: "report_closed_by_admin",
        title: "Reporte cerrado por administración",
        message: `Administración cerró tu reporte: ${previousReport.title}.`,
        entityType: "report",
        entityId: id,
        actionUrl: `/reports?focus=${id}`,
      });
    } else if (previousReport.status === "resolved") {
      await createNotification({
        recipientUserId: previousReport.userId,
        actorUserId: actor.userId,
        actorName: actor.userName,
        actorProfileImage: actor.userProfileImage,
        type: "report_reopened_by_admin",
        title: "Reporte reabierto por administración",
        message: `Administración reabrió tu reporte: ${previousReport.title}.`,
        entityType: "report",
        entityId: id,
        actionUrl: `/reports?focus=${id}`,
      });
    }
  }

  return report;
}

export async function hideReportAsAdmin(
  id: string,
  actor: ReportActorInput,
  reason?: string
): Promise<Report> {
  const report = await adminHideReport(id, actor.userId, reason);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "report_hidden",
    entityId: id,
    entityType: "report",
    description: reason || "Reporte ocultado por administración.",
  });

  await createNotification({
    recipientUserId: report.userId,
    actorUserId: actor.userId,
    actorName: actor.userName,
    actorProfileImage: actor.userProfileImage,
    type: "report_hidden",
    title: "Reporte ocultado",
    message: `Administración ocultó tu reporte: ${report.title}.`,
    entityType: "report",
    entityId: id,
    actionUrl: "/reports",
  });

  return report;
}

export async function restoreReportAsAdmin(
  id: string,
  actor: ReportActorInput
): Promise<Report> {
  const report = await adminRestoreReport(id);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "report_restored",
    entityId: id,
    entityType: "report",
    description: "Reporte restaurado por administración.",
  });

  await createNotification({
    recipientUserId: report.userId,
    actorUserId: actor.userId,
    actorName: actor.userName,
    actorProfileImage: actor.userProfileImage,
    type: "report_restored",
    title: "Reporte restaurado",
    message: `Administración restauró tu reporte: ${report.title}.`,
    entityType: "report",
    entityId: id,
    actionUrl: `/reports?focus=${id}`,
  });

  return report;
}

export async function deleteReportAsAdmin(
  id: string,
  actor: ReportActorInput
): Promise<void> {
  const previousReport = await db.reports.get(id);

  await adminDeleteReport(id);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "report_deleted",
    entityId: id,
    entityType: "report",
    description: "Reporte eliminado por administración.",
  });

  if (previousReport) {
    await createNotification({
      recipientUserId: previousReport.userId,
      actorUserId: actor.userId,
      actorName: actor.userName,
      actorProfileImage: actor.userProfileImage,
      type: "report_deleted",
      title: "Reporte eliminado",
      message: `Administración eliminó tu reporte: ${previousReport.title}.`,
      entityType: "report",
      entityId: id,
      actionUrl: "/reports",
    });
  }
}

export async function hideActivityAsAdmin(
  id: string,
  actor: ReportActorInput,
  reason?: string
): Promise<void> {
  await hideReportActivity(id, actor.userId, reason);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "activity_hidden",
    entityId: id,
    entityType: "report_activity",
    description: reason || "Comentario o avance ocultado por administración.",
  });
}

export async function restoreActivityAsAdmin(
  id: string,
  actor: ReportActorInput
): Promise<void> {
  await restoreReportActivity(id);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "activity_restored",
    entityId: id,
    entityType: "report_activity",
    description: "Comentario o avance restaurado por administración.",
  });
}

export async function deleteActivityAsAdmin(
  id: string,
  actor: ReportActorInput
): Promise<void> {
  await deleteReportActivity(id);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "activity_deleted",
    entityId: id,
    entityType: "report_activity",
    description: "Comentario o avance eliminado por administración.",
  });
}

export async function getAdminLessonsData(): Promise<AdminLessonsData> {
  const [lessons, progress] = await Promise.all([
    getAllEducationLessonsForAdmin(),
    getAllEducationProgress(),
  ]);

  return {
    lessons: lessons.map((lesson) => ({
      ...lesson,
      status: normalizeLessonStatus(lesson),
      isFeatured: lesson.isFeatured ?? false,
    })),
    completedByLesson: countBy(progress, (item) => item.lessonId),
  };
}

export async function createLessonAsAdmin(
  input: Omit<AdminCreateEducationLessonInput, "createdByUserId" | "createdByUserName">,
  actor: ReportActorInput
): Promise<EducationLesson> {
  const lesson = await adminCreateEducationLesson({
    ...input,
    createdByUserId: actor.userId,
    createdByUserName: actor.userName,
  });

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "lesson_created",
    entityId: lesson.id,
    entityType: "lesson",
    description: "Lección creada desde administración.",
  });

  return lesson;
}

export async function updateLessonAsAdmin(
  id: string,
  input: AdminUpdateEducationLessonInput,
  actor: ReportActorInput
): Promise<EducationLesson> {
  const previousLesson = await db.educationLessons.get(id);
  const lesson = await adminUpdateEducationLesson(id, input);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type:
      input.status === "published"
        ? "lesson_published"
        : input.status === "hidden"
          ? "lesson_hidden"
          : "lesson_updated",
    entityId: id,
    entityType: "lesson",
    description: "Lección actualizada por administración.",
  });

  const shouldNotifyAuthor =
    lesson.source === "user" &&
    Boolean(lesson.createdByUserId) &&
    lesson.createdByUserId !== actor.userId;

  if (shouldNotifyAuthor && previousLesson?.status !== lesson.status) {
    if (lesson.status === "published") {
      await createNotification({
        recipientUserId: lesson.createdByUserId as string,
        actorUserId: actor.userId,
        actorName: actor.userName,
        actorProfileImage: actor.userProfileImage,
        type: "lesson_published",
        title: "Lección publicada",
        message: `Administración aprobó y publicó tu lección: ${lesson.title}.`,
        entityType: "lesson",
        entityId: id,
        actionUrl: `/education/${id}`,
      });
    }

    if (lesson.status === "hidden") {
      await createNotification({
        recipientUserId: lesson.createdByUserId as string,
        actorUserId: actor.userId,
        actorName: actor.userName,
        actorProfileImage: actor.userProfileImage,
        type: "lesson_hidden",
        title: "Lección oculta",
        message: `Administración ocultó tu lección: ${lesson.title}.`,
        entityType: "lesson",
        entityId: id,
        actionUrl: "/education",
      });
    }
  }

  if (
    shouldNotifyAuthor &&
    previousLesson?.isFeatured !== lesson.isFeatured &&
    lesson.isFeatured !== undefined
  ) {
    await createNotification({
      recipientUserId: lesson.createdByUserId as string,
      actorUserId: actor.userId,
      actorName: actor.userName,
      actorProfileImage: actor.userProfileImage,
      type: lesson.isFeatured ? "lesson_featured" : "lesson_unfeatured",
      title: lesson.isFeatured ? "Lección destacada" : "Lección dejó de ser destacada",
      message: lesson.isFeatured
        ? `Administración marcó como destacada tu lección: ${lesson.title}.`
        : `Administración quitó la marca destacada de tu lección: ${lesson.title}.`,
      entityType: "lesson",
      entityId: id,
      actionUrl: lesson.status === "published" ? `/education/${id}` : "/education",
    });
  }

  return lesson;
}

export async function deleteLessonAsAdmin(
  id: string,
  actor: ReportActorInput
): Promise<void> {
  const previousLesson = await db.educationLessons.get(id);

  await adminDeleteEducationLesson(id);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: "lesson_deleted",
    entityId: id,
    entityType: "lesson",
    description: "Lección eliminada por administración.",
  });

  if (
    previousLesson?.source === "user" &&
    previousLesson.createdByUserId &&
    previousLesson.createdByUserId !== actor.userId
  ) {
    await createNotification({
      recipientUserId: previousLesson.createdByUserId,
      actorUserId: actor.userId,
      actorName: actor.userName,
      actorProfileImage: actor.userProfileImage,
      type: "lesson_deleted",
      title: "Lección eliminada",
      message: `Administración eliminó tu lección: ${previousLesson.title}.`,
      entityType: "lesson",
      entityId: id,
      actionUrl: "/education",
    });
  }
}

export async function getAdminUsersData(): Promise<AdminUsersData> {
  const [users, reports, activities, lessons, progress] = await Promise.all([
    db.users.orderBy("createdAt").reverse().toArray(),
    db.reports.toArray(),
    db.reportActivities.toArray(),
    getAllEducationLessonsForAdmin(),
    getAllEducationProgress(),
  ]);

  return {
    users,
    reportsByUser: countBy(reports, (report) => report.userId),
    activitiesByUser: countBy(activities, (activity) => activity.userId),
    lessonsByUser: countBy(lessons, (lesson) => lesson.createdByUserId),
    progressByUser: countBy(progress, (item) => item.userId),
  };
}

export async function setUserActiveStatusAsAdmin(
  id: string,
  isActive: boolean,
  actor: ReportActorInput
): Promise<User> {
  const user = await setUserActiveStatus(id, isActive);

  await trackAdminEvent({
    userId: actor.userId,
    userName: actor.userName,
    type: isActive ? "user_reactivated" : "user_deactivated",
    entityId: id,
    entityType: "user",
    description: isActive
      ? "Usuario reactivado por administración."
      : "Usuario desactivado por administración.",
  });

  return user;
}
