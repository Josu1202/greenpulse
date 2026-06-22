"use client";

import { useCallback, useEffect, useState } from "react";

import { seedDatabase } from "@/db/seed";

export function useDatabaseSeed() {
  const [isSeedLoading, setIsSeedLoading] = useState(true);
  const [seedError, setSeedError] = useState<string | null>(null);

  const initializeDatabase = useCallback(async () => {
    try {
      setIsSeedLoading(true);
      setSeedError(null);

      await seedDatabase();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo inicializar la base de datos local.";

      setSeedError(message);
    } finally {
      setIsSeedLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void initializeDatabase();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [initializeDatabase]);

  return {
    isSeedLoading,
    seedError,
    initializeDatabase,
  };
}