"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createReport,
  deleteReport,
  getAllReports,
  updateReport,
  updateReportStatus,
  type CreateReportInput,
  type UpdateReportInput,
} from "@/db/repositories";
import type { Report, ReportStatus } from "@/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "all">(
    "all"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
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
  }, []);

  const createNewReport = async (input: CreateReportInput) => {
    try {
      setError(null);

      const report = await createReport(input);
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

  const editReport = async (id: string, input: UpdateReportInput) => {
    try {
      setError(null);

      await updateReport(id, input);
      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el reporte.";

      setError(message);
      throw error;
    }
  };

  const changeReportStatus = async (id: string, status: ReportStatus) => {
    try {
      setError(null);

      await updateReportStatus(id, status);
      await loadReports();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado del reporte.";

      setError(message);
      throw error;
    }
  };

  const removeReport = async (id: string) => {
    try {
      setError(null);

      await deleteReport(id);
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
    isLoading,
    error,
    setSelectedStatus,
    setSelectedCategoryId,
    loadReports,
    createNewReport,
    editReport,
    changeReportStatus,
    removeReport,
  };
}