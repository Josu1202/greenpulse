"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  completeEducationLesson,
  createEducationLesson,
  getBaseEducationLessons,
  getEducationLessonById,
  getEducationProgressByUser,
  getUserEducationLessons,
  type CreateEducationLessonInput,
} from "@/db/repositories";
import type { EducationLesson, EducationLessonProgress } from "@/types";
import { getEarnedEducationBadges, getNextEducationBadge } from "@/utils";

import { useAuth } from "./useAuth";

type CreateUserLessonInput = Omit<
  CreateEducationLessonInput,
  "createdByUserId" | "createdByUserName"
>;

export function useEducation() {
  const { user } = useAuth();

  const [baseLessons, setBaseLessons] = useState<EducationLesson[]>([]);
  const [userLessons, setUserLessons] = useState<EducationLesson[]>([]);
  const [progress, setProgress] = useState<EducationLessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEducation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [baseLessonsData, userLessonsData, progressData] =
        await Promise.all([
          getBaseEducationLessons(),
          getUserEducationLessons(),
          user ? getEducationProgressByUser(user.id) : Promise.resolve([]),
        ]);

      setBaseLessons(baseLessonsData);
      setUserLessons(userLessonsData);
      setProgress(progressData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar el módulo educativo.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getLesson = useCallback(async (lessonId: string) => {
    try {
      setError(null);

      const lesson = await getEducationLessonById(lessonId);

      if (!lesson) {
        throw new Error("La lección no existe.");
      }

      return lesson;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar la lección.";

      setError(message);
      throw error;
    }
  }, []);

  const createUserLesson = useCallback(
    async (input: CreateUserLessonInput) => {
      if (!user) {
        throw new Error("Debes iniciar sesión para crear una lección.");
      }

      try {
        setError(null);

        const lesson = await createEducationLesson({
          ...input,
          createdByUserId: user.id,
          createdByUserName: user.name,
        });

        await loadEducation();

        return lesson;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo crear la lección.";

        setError(message);
        throw error;
      }
    },
    [loadEducation, user]
  );

  const completeLesson = useCallback(
    async (lessonId: string, score: number, totalQuestions: number) => {
      if (!user) {
        throw new Error("Debes iniciar sesión para completar una lección.");
      }

      try {
        setError(null);

        const lessonProgress = await completeEducationLesson({
          userId: user.id,
          lessonId,
          score,
          totalQuestions,
        });

        await loadEducation();

        return lessonProgress;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo completar la lección.";

        setError(message);
        throw error;
      }
    },
    [loadEducation, user]
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return progress.some((item) => item.lessonId === lessonId);
    },
    [progress]
  );

  const completedLessonsCount = progress.length;

  const earnedBadges = useMemo(() => {
    return getEarnedEducationBadges(completedLessonsCount);
  }, [completedLessonsCount]);

  const nextBadge = useMemo(() => {
    return getNextEducationBadge(completedLessonsCount);
  }, [completedLessonsCount]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEducation();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadEducation]);

  return {
    baseLessons,
    userLessons,
    allLessons: [...baseLessons, ...userLessons],
    progress,
    completedLessonsCount,
    earnedBadges,
    nextBadge,
    isLoading,
    error,
    loadEducation,
    getLesson,
    createUserLesson,
    completeLesson,
    isLessonCompleted,
  };
}