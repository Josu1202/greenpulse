"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAllReportActivities,
  getAllStatusLogs,
} from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";
import type { ReportActivity, StatusLog } from "@/types";

// Carga los datos transversales que el dashboard necesita además de los
// reportes: el historial de cambios de estado (statusLogs) para medir tiempos
// de resolución y las actividades para el feed de actividad reciente.
export function useDashboardData() {
  const { isLoading: isAuthLoading } = useAuth();

  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);
  const [activities, setActivities] = useState<ReportActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [logs, acts] = await Promise.all([
        getAllStatusLogs(),
        getAllReportActivities(),
      ]);

      setStatusLogs(logs);
      setActivities(acts);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos del dashboard.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadData]);

  return {
    statusLogs,
    activities,
    isLoading: isLoading || isAuthLoading,
    error,
    reload: loadData,
  };
}
