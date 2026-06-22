import { db } from "@/db/database";
import type { EducationLesson, EducationLessonProgress } from "@/types";
import { BASE_EDUCATION_LESSONS } from "@/utils";

export interface CreateEducationLessonInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
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

export async function seedBaseEducationLessonsIfEmpty(): Promise<void> {
  const baseLessonsCount = await db.educationLessons
    .where("source")
    .equals("base")
    .count();

  if (baseLessonsCount === 0) {
    await db.educationLessons.bulkPut(BASE_EDUCATION_LESSONS);
  }
}

export async function getAllEducationLessons(): Promise<EducationLesson[]> {
  await seedBaseEducationLessonsIfEmpty();

  return db.educationLessons.orderBy("createdAt").toArray();
}

export async function getBaseEducationLessons(): Promise<EducationLesson[]> {
  await seedBaseEducationLessonsIfEmpty();

  return db.educationLessons.where("source").equals("base").toArray();
}

export async function getUserEducationLessons(): Promise<EducationLesson[]> {
  return db.educationLessons.where("source").equals("user").toArray();
}

export async function getEducationLessonById(
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
    estimatedMinutes: input.estimatedMinutes,
    source: "user",
    createdByUserId: input.createdByUserId,
    createdByUserName: input.createdByUserName,
    questions: input.questions,
    createdAt: now,
    updatedAt: now,
  };

  await db.educationLessons.add(lesson);

  return lesson;
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