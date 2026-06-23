"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAdminUsersData,
  setUserActiveStatusAsAdmin,
  type AdminUsersData,
} from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdminUsers() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminUsersData>({
    users: [],
    reportsByUser: {},
    activitiesByUser: {},
    lessonsByUser: {},
    progressByUser: {},
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

      const adminData = await getAdminUsersData();
      setData(adminData);
    } catch (error) {
      setError(getErrorMessage(error, "No se pudieron cargar los usuarios."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveStatus = async (id: string, isActive: boolean) => {
    try {
      setError(null);
      await setUserActiveStatusAsAdmin(id, isActive, getActor());
      await loadData();
    } catch (error) {
      setError(
        getErrorMessage(error, "No se pudo cambiar el estado del usuario.")
      );
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
    currentUser: user,
    isLoading,
    error,
    loadData,
    setActiveStatus,
  };
}
