"use client";

import { useMemo } from "react";

import { MainLayout, ProtectedRoute } from "@/components/layout";
import {
  CategoryChart,
  KpiCard,
  RecentActivity,
  StatusChart,
} from "@/components/dashboard";
import { useCategories, useReports } from "@/hooks";
import {
  actividadReciente,
  calcularKpis,
  reportesPorCategoria,
  reportesPorEstado,
} from "@/features/dashboard/dashboardStats";

function DashboardContent() {
  const { reports, isLoading, error } = useReports();
  const { categories } = useCategories();

  const kpis = useMemo(() => calcularKpis(reports), [reports]);
  const porCategoria = useMemo(
    () => reportesPorCategoria(reports, categories),
    [reports, categories]
  );
  const porEstado = useMemo(() => reportesPorEstado(reports), [reports]);
  const recientes = useMemo(() => actividadReciente(reports, 5), [reports]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="text-slate-600">
            Resumen general de la actividad ambiental.
          </p>
        </div>

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
              <CategoryChart data={porCategoria} />
              <StatusChart data={porEstado} />
            </div>

            <RecentActivity reports={recientes} categories={categories} />
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
