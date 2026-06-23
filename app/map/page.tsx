"use client";

import { useMemo, useState } from "react";

import { DashboardLayout, ProtectedRoute } from "@/components/layout";
import { Card } from "@/components/ui";
import { MapFilters, MapView } from "@/components/maps";
import { useCategories, useReports } from "@/hooks";
import { filterReportsByPriority } from "@/features/reports/reportPresentation";
import { getReportsWithCoordinates } from "@/features/map/mapHelpers";
import type { ReportPriority } from "@/types";

function MapContent() {
  const {
    filteredReports,
    selectedStatus,
    selectedCategoryId,
    isLoading,
    error,
    setSelectedStatus,
    setSelectedCategoryId,
  } = useReports();

  const { categories } = useCategories();

  const [selectedPriority, setSelectedPriority] = useState<
    ReportPriority | "all"
  >("all");

  const visibleReports = useMemo(() => {
    const byPriority = filterReportsByPriority(filteredReports, selectedPriority);
    return getReportsWithCoordinates(byPriority);
  }, [filteredReports, selectedPriority]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Mapa ambiental</h1>
          <p className="text-slate-600">
            Visualiza los reportes ambientales según su ubicación.
          </p>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Card className="h-fit">
            <MapFilters
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              selectedStatus={selectedStatus}
              selectedPriority={selectedPriority}
              onCategoryChange={setSelectedCategoryId}
              onStatusChange={setSelectedStatus}
              onPriorityChange={setSelectedPriority}
              totalVisibles={visibleReports.length}
            />
          </Card>

          {isLoading ? (
            <Card className="flex h-[520px] items-center justify-center text-slate-500">
              Cargando reportes...
            </Card>
          ) : (
            <MapView reports={visibleReports} categories={categories} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function MapPage() {
  return (
    <ProtectedRoute>
      <MapContent />
    </ProtectedRoute>
  );
}
