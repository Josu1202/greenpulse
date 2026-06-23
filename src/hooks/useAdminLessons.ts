"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createLessonAsAdmin,
  deleteLessonAsAdmin,
  getAdminLessonsData,
  updateLessonAsAdmin,
  type AdminLessonsData,
  type AdminUpdateEducationLessonInput,
} from "@/db/repositories";
import type { EducationLesson, EducationLessonStatus } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface AdminCreateLessonInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes: number;
  status: EducationLessonStatus;
  isFeatured: boolean;
  questions: EducationLesson["questions"];
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdminLessons() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminLessonsData>({
    lessons: [],
    completedByLesson: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getActor = useCallback(() => {
    if (!user) {
      throw new Error("Debes iniciar sesión como administrador.");
    }

    return {
      userId: user.id,
      userName: user.name,
      userProfileImage: user.profileImage,
    };
  }, [user]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const adminData = await getAdminLessonsData();
      setData(adminData);
    } catch (error) {
      setError(getErrorMessage(error, "No se pudieron cargar las lecciones."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLesson = async (input: AdminCreateLessonInput) => {
    try {
      setError(null);
      await createLessonAsAdmin(input, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo crear la lección."));
      throw error;
    }
  };

  const updateLesson = async (
    id: string,
    input: AdminUpdateEducationLessonInput
  ) => {
    try {
      setError(null);
      await updateLessonAsAdmin(id, input, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo actualizar la lección."));
      throw error;
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      setError(null);
      await deleteLessonAsAdmin(id, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo eliminar la lección."));
      throw error;
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData]);

  return {
    ...data,
    isLoading,
    error,
    loadData,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}
