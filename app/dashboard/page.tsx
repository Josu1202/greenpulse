"use client";

import { useMemo, useState } from "react";

import { DashboardLayout, ProtectedRoute } from "@/components/layout";
import {
  CategoryChart,
  DashboardFilters,
  ImpactCard,
  KpiCard,
  RecentActivity,
  ResolutionCard,
  StatusChart,
  TrendChart,
  rangeToDays,
  type DashboardRange,
} from "@/components/dashboard";
import { useCategories, useReports } from "@/hooks";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  calcularImpacto,
  calcularKpis,
  calcularResolucion,
  reportesPorCategoria,
  reportesPorEstado,
  reportesPorPrioridad,
  tendenciaTemporal,
} from "@/features/dashboard/dashboardStats";
import { construirActividad } from "@/features/dashboard/dashboardActivity";

function inicioDelRango(dias: number | null): number | null {
  if (dias === null) {
    return null;
  }

  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() - (dias - 1));

  return fecha.getTime();
}

function DashboardContent() {
  const { reports, isLoading: loadingReports, error: errorReports } =
    useReports();
  const { categories } = useCategories();
  const {
    statusLogs,
    activities,
    isLoading: loadingData,
    error: errorData,
  } = useDashboardData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedRange, setSelectedRange] = useState<DashboardRange>("30");

  const isLoading = loadingReports || loadingData;
  const error = errorReports ?? errorData;

  // --- Filtros aplicados a TODOS los indicadores ---
  const reportesFiltrados = useMemo(() => {
    const desde = inicioDelRango(rangeToDays(selectedRange));

    return reports.filter((report) => {
      const coincideCategoria =
        selectedCategoryId === "all" ||
        report.categoryId === selectedCategoryId;

      if (!coincideCategoria) {
        return false;
      }

      if (desde === null) {
        return true;
      }

      const creado = new Date(report.createdAt).getTime();
      return Number.isFinite(creado) && creado >= desde;
    });
  }, [reports, selectedCategoryId, selectedRange]);

  const idsFiltrados = useMemo(
    () => new Set(reportesFiltrados.map((report) => report.id)),
    [reportesFiltrados]
  );

  const statusLogsFiltrados = useMemo(
    () => statusLogs.filter((log) => idsFiltrados.has(log.reportId)),
    [statusLogs, idsFiltrados]
  );

  const activitiesFiltradas = useMemo(
    () => activities.filter((activity) => idsFiltrados.has(activity.reportId)),
    [activities, idsFiltrados]
  );

  // --- Indicadores derivados ---
  const kpis = useMemo(() => calcularKpis(reportesFiltrados), [reportesFiltrados]);

  const impacto = useMemo(
    () => calcularImpacto(reportesFiltrados, categories),
    [reportesFiltrados, categories]
  );

  const resolucion = useMemo(
    () => calcularResolucion(reportesFiltrados, statusLogsFiltrados),
    [reportesFiltrados, statusLogsFiltrados]
  );

  const porCategoria = useMemo(
    () => reportesPorCategoria(reportesFiltrados, categories),
    [reportesFiltrados, categories]
  );

  const porEstado = useMemo(
    () => reportesPorEstado(reportesFiltrados),
    [reportesFiltrados]
  );

  const porPrioridad = useMemo(
    () => reportesPorPrioridad(reportesFiltrados),
    [reportesFiltrados]
  );

  const tendencia = useMemo(
    () => tendenciaTemporal(reportesFiltrados, rangeToDays(selectedRange)),
    [reportesFiltrados, selectedRange]
  );

  const eventos = useMemo(
    () => construirActividad(activitiesFiltradas, reportesFiltrados, categories, 8),
    [activitiesFiltradas, reportesFiltrados, categories]
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="text-slate-600">
            Resumen general de la actividad ambiental.
          </p>
        </div>

        <DashboardFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          selectedRange={selectedRange}
          totalVisibles={reportesFiltrados.length}
          onCategoryChange={setSelectedCategoryId}
          onRangeChange={setSelectedRange}
        />

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="py-8 text-center text-slate-500">
            Cargando indicadores...
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                label="Total de reportes"
                value={kpis.total}
                accentColor="#16a34a"
              />
              <KpiCard
                label="Pendientes"
                value={kpis.pendientes}
                accentColor="#f59e0b"
              />
              <KpiCard
                label="En revisión"
                value={kpis.enRevision}
                accentColor="#0ea5e9"
              />
              <KpiCard
                label="Resueltos"
                value={kpis.resueltos}
                accentColor="#22c55e"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ImpactCard impact={impacto} />
              <ResolutionCard resolution={resolucion} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <CategoryChart data={porCategoria} />
              <StatusChart data={porEstado} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <StatusChart data={porPrioridad} title="Reportes por prioridad" />
              <TrendChart data={tendencia} />
            </div>

            <RecentActivity events={eventos} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
