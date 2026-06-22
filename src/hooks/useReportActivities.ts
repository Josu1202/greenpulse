"use client";

import { useCallback, useEffect, useState } from "react";

import {
  addReportComment,
  addReportProgressUpdate,
  getActivitiesByReport,
} from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";
import type { ReportActivity, ReportPriority, ReportStatus } from "@/types";

export interface AddCurrentUserCommentInput {
  comment: string;
  image?: string;
}

export interface AddCurrentUserProgressInput {
  comment: string;
  status: ReportStatus;
  priority: ReportPriority;
  image?: string;
}

export function useReportActivities(reportId: string) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ReportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getActivitiesByReport(reportId);
      setActivities(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar el historial del reporte.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  const getActor = () => {
    if (!user) {
      throw new Error("Debes iniciar sesión para participar en reportes.");
    }

    return {
      userId: user.id,
      userName: user.name,
      userProfileImage: user.profileImage,
    };
  };

  const addComment = async (
    input: AddCurrentUserCommentInput
  ): Promise<ReportActivity> => {
    try {
      setError(null);

      const activity = await addReportComment({
        ...input,
        reportId,
        ...getActor(),
      });

      await loadActivities();

      return activity;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo agregar el comentario.";

      setError(message);
      throw error;
    }
  };

  const addProgressUpdate = async (
    input: AddCurrentUserProgressInput
  ): Promise<ReportActivity> => {
    try {
      setError(null);

      const activity = await addReportProgressUpdate({
        ...input,
        reportId,
        ...getActor(),
      });

      await loadActivities();

      return activity;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo agregar el avance.";

      setError(message);
      throw error;
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadActivities();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadActivities]);

  return {
    activities,
    isLoading,
    error,
    loadActivities,
    addComment,
    addProgressUpdate,
  };
}
