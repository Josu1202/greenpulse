import Dexie, { type Table } from "dexie";

import type {
  AdminEvent,
  AppSettings,
  Category,
  EducationLesson,
  EducationLessonProgress,
  Report,
  ReportActivity,
  StatusLog,
  User,
} from "@/types";

export class GreenPulseDatabase extends Dexie {
  users!: Table<User, string>;
  reports!: Table<Report, string>;
  categories!: Table<Category, string>;
  statusLogs!: Table<StatusLog, string>;
  settings!: Table<AppSettings, string>;
  reportActivities!: Table<ReportActivity, string>;
  educationLessons!: Table<EducationLesson, string>;
  educationProgress!: Table<EducationLessonProgress, string>;
  adminEvents!: Table<AdminEvent, string>;

  constructor() {
    super("GreenPulseDB");

    this.version(1).stores({
      users: "id, email, role, createdAt",
      reports:
        "id, userId, categoryId, status, priority, createdAt, updatedAt",
      categories: "id, name",
      statusLogs: "id, reportId, changedAt",
      settings: "id, seedLoaded",
    });

    this.version(2).stores({
      users: "id, email, role, createdAt",
      reports:
        "id, userId, categoryId, status, priority, createdAt, updatedAt",
      categories: "id, name",
      statusLogs: "id, reportId, changedAt",
      settings: "id, seedLoaded",
      reportActivities: "id, reportId, userId, type, createdAt",
    });

    this.version(3).stores({
      users: "id, email, role, createdAt",
      reports:
        "id, userId, categoryId, status, priority, createdAt, updatedAt",
      categories: "id, name",
      statusLogs: "id, reportId, changedAt",
      settings: "id, seedLoaded",
      reportActivities: "id, reportId, userId, type, createdAt",
      educationLessons: "id, source, createdByUserId, createdAt",
      educationProgress: "id, userId, lessonId, [userId+lessonId], completedAt",
    });

    this.version(4).stores({
      users: "id, email, role, isActive, createdAt",
      reports:
        "id, userId, categoryId, status, priority, isHidden, createdAt, updatedAt",
      categories: "id, name",
      statusLogs: "id, reportId, changedAt",
      settings: "id, seedLoaded",
      reportActivities: "id, reportId, userId, type, isHidden, createdAt",
      educationLessons: "id, source, status, isFeatured, createdByUserId, createdAt",
      educationProgress: "id, userId, lessonId, [userId+lessonId], completedAt",
      adminEvents: "id, userId, type, path, entityId, entityType, createdAt",
    });
  }
}

export const db = new GreenPulseDatabase();
