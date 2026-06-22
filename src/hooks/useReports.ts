"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createReport,
  deleteReport,
  getAllReports,
  updateReport,
  updateReportPriority,
  updateReportStatus,
  type CreateReportInput,
  type UpdateReportInput,
} from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";
import type { Report, ReportPriority, ReportStatus } from "@/types";

export type CreateCurrentUserReportInput = Omit<
  CreateReportInput,
  "userId" | "userName" | "userProfileImage"
>;

export function useReports() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "all">(
    "all"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    if (isAuthLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllReports();
      setReports(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los reportes.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading]);

  const createNewReport = async (
    input: CreateCurrentUserReportInput
  ): Promise<Report> => {
    if (!user) {
      throw new Error("Debes iniciar sesión para crear reportes.");
    }

    try {
      setError(null);

      const report = await createReport({
        ...input,
        userId: user.id,
        userName: user.name,
        userProfileImage: user.profileImage,
      });

      await loadReports();

      return report;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo crear el reporte.";

      setError(message);
      throw error;
    }
  };

  const editReport = async (
    id: string,
    input: UpdateReportInput
  ): Promise<Report> => {
    if (!user) {
      throw new Error("Debes iniciar sesión para editar reportes.");
    }

    try {
      setError(null);

      const updatedReport = await updateReport(id, input, {
        userId: user.id,
        userName: user.name,
        userProfileImage: user.profileImage,
      });

      await loadReports();

      return updatedReport;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el reporte.";

      setError(message);
      throw error;
    }
  };

  const changeReportStatus = async (
    id: string,
    status: ReportStatus
  ): Promise<Report> => {
    if (!user) {
      throw new Error("Debes iniciar sesión para cambiar el estado.");
    }

    try {
      setError(null);

      const updatedReport = await updateReportStatus(id, status, {
        userId: user.id,
        userName: user.name,
        userProfileImage: user.profileImage,
      });

      await loadReports();

      return updatedReport;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado del reporte.";

      setError(message);
      throw error;
    }
  };

  const changeReportPriority = async (
    id: string,
    priority: ReportPriority
  ): Promise<Report> => {
    if (!user) {
      throw new Error("Debes iniciar sesión para cambiar la prioridad.");
    }

    try {
      setError(null);

      const updatedReport = await updateReportPriority(id, priority, {
        userId: user.id,
        userName: user.name,
        userProfileImage: user.profileImage,
      });

      await loadReports();

      return updatedReport;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la prioridad del reporte.";

      setError(message);
      throw error;
    }
  };

  const removeReport = async (id: string): Promise<void> => {
    if (!user) {
      throw new Error("Debes iniciar sesión para eliminar reportes.");
    }

    try {
      setError(null);

      await deleteReport(id, user.id);
      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el reporte.";

      setError(message);
      throw error;
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus =
        selectedStatus === "all" || report.status === selectedStatus;

      const matchesCategory =
        selectedCategoryId === "all" ||
        report.categoryId === selectedCategoryId;

      return matchesStatus && matchesCategory;
    });
  }, [reports, selectedStatus, selectedCategoryId]);

  function isReportOwner(report: Report): boolean {
    return Boolean(user && report.userId === user.id);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadReports]);

  return {
    reports,
    filteredReports,
    selectedStatus,
    selectedCategoryId,
    isLoading: isLoading || isAuthLoading,
    error,
    currentUser: user,
    setSelectedStatus,
    setSelectedCategoryId,
    loadReports,
    createNewReport,
    editReport,
    changeReportStatus,
    changeReportPriority,
    removeReport,
    isReportOwner,
  };
}
