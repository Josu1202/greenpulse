import { db } from "@/db/database";
import type {
  EducationLesson,
  EducationLessonProgress,
  EducationLessonStatus,
} from "@/types";
import { BASE_EDUCATION_LESSONS } from "@/utils";

export interface CreateEducationLessonInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes: number;
  createdByUserId: string;
  createdByUserName: string;
  questions: EducationLesson["questions"];
}

export interface CompleteEducationLessonInput {
  userId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
}

export interface AdminCreateEducationLessonInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes: number;
  status: EducationLessonStatus;
  isFeatured?: boolean;
  createdByUserId: string;
  createdByUserName: string;
  questions: EducationLesson["questions"];
}

export interface AdminUpdateEducationLessonInput {
  title?: string;
  summary?: string;
  content?: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes?: number;
  status?: EducationLessonStatus;
  isFeatured?: boolean;
  questions?: EducationLesson["questions"];
}

function normalizeLessonStatus(lesson: EducationLesson): EducationLessonStatus {
  if (lesson.status) {
    return lesson.status;
  }

  return lesson.source === "base" ? "published" : "pending_review";
}

function isPublicLesson(lesson: EducationLesson): boolean {
  return normalizeLessonStatus(lesson) === "published";
}

export async function seedBaseEducationLessonsIfEmpty(): Promise<void> {
  const baseLessonsCount = await db.educationLessons
    .where("source")
    .equals("base")
    .count();

  if (baseLessonsCount === 0) {
    await db.educationLessons.bulkPut(
      BASE_EDUCATION_LESSONS.map((lesson) => ({
        ...lesson,
        status: "published" as EducationLessonStatus,
        isFeatured: lesson.isFeatured ?? false,
      }))
    );
  }
}

export async function getAllEducationLessons(): Promise<EducationLesson[]> {
  await seedBaseEducationLessonsIfEmpty();

  const lessons = await db.educationLessons.orderBy("createdAt").toArray();

  return lessons.filter(isPublicLesson);
}

export async function getAllEducationLessonsForAdmin(): Promise<EducationLesson[]> {
  await seedBaseEducationLessonsIfEmpty();

  return db.educationLessons.orderBy("createdAt").toArray();
}

export async function getBaseEducationLessons(): Promise<EducationLesson[]> {
  await seedBaseEducationLessonsIfEmpty();

  const lessons = await db.educationLessons.where("source").equals("base").toArray();

  return lessons.filter(isPublicLesson);
}

export async function getUserEducationLessons(): Promise<EducationLesson[]> {
  const lessons = await db.educationLessons.where("source").equals("user").toArray();

  return lessons.filter(isPublicLesson);
}

export async function getEducationLessonById(
  id: string
): Promise<EducationLesson | undefined> {
  await seedBaseEducationLessonsIfEmpty();

  const lesson = await db.educationLessons.get(id);

  if (!lesson || !isPublicLesson(lesson)) {
    return undefined;
  }

  return lesson;
}

export async function getEducationLessonByIdForAdmin(
  id: string
): Promise<EducationLesson | undefined> {
  await seedBaseEducationLessonsIfEmpty();

  return db.educationLessons.get(id);
}

export async function createEducationLesson(
  input: CreateEducationLessonInput
): Promise<EducationLesson> {
  const now = new Date().toISOString();

  const lesson: EducationLesson = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    content: input.content.trim(),
    image: input.image,
    referenceImages: input.referenceImages,
    estimatedMinutes: input.estimatedMinutes,
    source: "user",
    status: "pending_review",
    isFeatured: false,
    createdByUserId: input.createdByUserId,
    createdByUserName: input.createdByUserName,
    questions: input.questions,
    createdAt: now,
    updatedAt: now,
  };

  await db.educationLessons.add(lesson);

  return lesson;
}

export async function adminCreateEducationLesson(
  input: AdminCreateEducationLessonInput
): Promise<EducationLesson> {
  const title = input.title.trim();
  const summary = input.summary.trim();
  const content = input.content.trim();

  if (!title) {
    throw new Error("El título de la lección es obligatorio.");
  }

  if (!summary) {
    throw new Error("El resumen de la lección es obligatorio.");
  }

  if (!content) {
    throw new Error("El contenido de la lección es obligatorio.");
  }

  if (!Number.isFinite(input.estimatedMinutes) || input.estimatedMinutes < 1) {
    throw new Error("El tiempo estimado debe ser mayor a cero.");
  }

  const now = new Date().toISOString();

  const lesson: EducationLesson = {
    id: crypto.randomUUID(),
    title,
    summary,
    content,
    image: input.image,
    referenceImages: input.referenceImages,
    estimatedMinutes: input.estimatedMinutes,
    source: "base",
    status: input.status,
    isFeatured: input.isFeatured ?? false,
    createdByUserId: input.createdByUserId,
    createdByUserName: input.createdByUserName,
    questions: input.questions,
    createdAt: now,
    updatedAt: now,
  };

  await db.educationLessons.add(lesson);

  return lesson;
}

export async function adminUpdateEducationLesson(
  id: string,
  input: AdminUpdateEducationLessonInput
): Promise<EducationLesson> {
  const existingLesson = await db.educationLessons.get(id);

  if (!existingLesson) {
    throw new Error("La lección no existe.");
  }

  const changes: Partial<EducationLesson> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.title !== undefined) {
    changes.title = input.title.trim();
  }

  if (input.summary !== undefined) {
    changes.summary = input.summary.trim();
  }

  if (input.content !== undefined) {
    changes.content = input.content.trim();
  }

  if (input.image !== undefined) {
    changes.image = input.image;
  }

  if (input.referenceImages !== undefined) {
    changes.referenceImages = input.referenceImages;
    changes.image = input.referenceImages[0] ?? input.image;
  }

  if (input.estimatedMinutes !== undefined) {
    changes.estimatedMinutes = input.estimatedMinutes;
  }

  if (input.questions !== undefined) {
    changes.questions = input.questions;
  }

  if (input.status !== undefined) {
    changes.status = input.status;
  }

  if (input.isFeatured !== undefined) {
    changes.isFeatured = input.isFeatured;
  }

  await db.educationLessons.update(id, changes);

  const updatedLesson = await db.educationLessons.get(id);

  if (!updatedLesson) {
    throw new Error("No se pudo recuperar la lección actualizada.");
  }

  return updatedLesson;
}

export async function adminDeleteEducationLesson(id: string): Promise<void> {
  const existingLesson = await db.educationLessons.get(id);

  if (!existingLesson) {
    throw new Error("La lección no existe.");
  }

  await db.transaction("rw", db.educationLessons, db.educationProgress, async () => {
    await db.educationProgress.where("lessonId").equals(id).delete();
    await db.educationLessons.delete(id);
  });
}

export async function completeEducationLesson(
  input: CompleteEducationLessonInput
): Promise<EducationLessonProgress> {
  const existingProgress = await db.educationProgress
    .where("[userId+lessonId]")
    .equals([input.userId, input.lessonId])
    .first();

  const progress: EducationLessonProgress = {
    id: existingProgress?.id ?? crypto.randomUUID(),
    userId: input.userId,
    lessonId: input.lessonId,
    score: input.score,
    totalQuestions: input.totalQuestions,
    completedAt: new Date().toISOString(),
  };

  await db.educationProgress.put(progress);

  return progress;
}

export async function getAllEducationProgress(): Promise<EducationLessonProgress[]> {
  return db.educationProgress.orderBy("completedAt").reverse().toArray();
}

export async function getEducationProgressByUser(
  userId: string
): Promise<EducationLessonProgress[]> {
  return db.educationProgress.where("userId").equals(userId).toArray();
}

export async function hasUserCompletedLesson(
  userId: string,
  lessonId: string
): Promise<boolean> {
  const progress = await db.educationProgress
    .where("[userId+lessonId]")
    .equals([userId, lessonId])
    .first();

  return Boolean(progress);
}

export async function getCompletedLessonsCount(userId: string): Promise<number> {
  return db.educationProgress.where("userId").equals(userId).count();
}
