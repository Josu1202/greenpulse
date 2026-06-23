"use client";

import { useCallback, useEffect, useState } from "react";

import { getAdminDashboardStats } from "@/db/repositories";
import type { AdminDashboardStats } from "@/types";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las estadísticas administrativas."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStats();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
  };
}
