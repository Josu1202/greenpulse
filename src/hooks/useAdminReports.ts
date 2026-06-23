"use client";

import { useCallback, useEffect, useState } from "react";

import {
  deleteActivityAsAdmin,
  deleteReportAsAdmin,
  getAdminReportsData,
  hideActivityAsAdmin,
  hideReportAsAdmin,
  restoreActivityAsAdmin,
  restoreReportAsAdmin,
  updateReportAsAdmin,
  type AdminReportsData,
  type AdminUpdateReportInput,
} from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";
import type { ReportActivity } from "@/types";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdminReports() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminReportsData>({
    reports: [],
    activities: [],
    users: [],
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

      const adminData = await getAdminReportsData();
      setData(adminData);
    } catch (error) {
      setError(getErrorMessage(error, "No se pudieron cargar los reportes."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReport = async (id: string, input: AdminUpdateReportInput) => {
    try {
      setError(null);
      await updateReportAsAdmin(id, input, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo actualizar el reporte."));
      throw error;
    }
  };

  const hideReport = async (id: string, reason?: string) => {
    try {
      setError(null);
      await hideReportAsAdmin(id, getActor(), reason);
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo ocultar el reporte."));
      throw error;
    }
  };

  const restoreReport = async (id: string) => {
    try {
      setError(null);
      await restoreReportAsAdmin(id, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo restaurar el reporte."));
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      setError(null);
      await deleteReportAsAdmin(id, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo eliminar el reporte."));
      throw error;
    }
  };

  const hideActivity = async (id: string, reason?: string) => {
    try {
      setError(null);
      await hideActivityAsAdmin(id, getActor(), reason);
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo ocultar la actividad."));
      throw error;
    }
  };

  const restoreActivity = async (id: string) => {
    try {
      setError(null);
      await restoreActivityAsAdmin(id, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo restaurar la actividad."));
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setError(null);
      await deleteActivityAsAdmin(id, getActor());
      await loadData();
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo eliminar la actividad."));
      throw error;
    }
  };

  function getActivitiesByReport(reportId: string): ReportActivity[] {
    return data.activities.filter((activity) => activity.reportId === reportId);
  }

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
    updateReport,
    hideReport,
    restoreReport,
    deleteReport,
    hideActivity,
    restoreActivity,
    deleteActivity,
    getActivitiesByReport,
  };
}
