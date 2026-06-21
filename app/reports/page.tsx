"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui";
import { ReportFilters, ReportTable } from "@/components/reports";
import { useCategories, useReports } from "@/hooks";
import { filterReportsByPriority } from "@/features/reports/reportPresentation";
import type { ReportPriority } from "@/types";

export default function ReportsPage() {
  const {
    filteredReports,
    selectedStatus,
    selectedCategoryId,
    isLoading,
    error,
    setSelectedStatus,
    setSelectedCategoryId,
    changeReportStatus,
    removeReport,
  } = useReports();

  const { categories } = useCategories();

  // El hook ya filtra por estado y categoría.
  // La prioridad se aplica aquí como función pura sin tocar el hook de Persona 2.
  const [selectedPriority, setSelectedPriority] = useState<
    ReportPriority | "all"
  >("all");

  const visibleReports = useMemo(
    () => filterReportsByPriority(filteredReports, selectedPriority),
    [filteredReports, selectedPriority]
  );

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar este reporte? Esta acción no se puede deshacer."
    );
    if (confirmed) {
      await removeReport(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Reportes</h1>
            <p className="text-slate-600">
              Gestiona y da seguimiento a los reportes ambientales.
            </p>
          </div>
          <Link href="/reports/new">
            <Button variant="primary">+ Nuevo reporte</Button>
          </Link>
        </div>

        {/* Filtros */}
        <ReportFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onCategoryChange={setSelectedCategoryId}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
        />

        {/* Error de carga */}
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {/* Tabla de reportes */}
        {isLoading ? (
          <p className="py-8 text-center text-slate-500">
            Cargando reportes...
          </p>
        ) : (
          <ReportTable
            reports={visibleReports}
            categories={categories}
            onChangeStatus={changeReportStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </MainLayout>
  );
}
