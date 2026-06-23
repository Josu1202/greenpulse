"use client";

import { useMemo, useState } from "react";

import { DashboardLayout, ProtectedRoute } from "@/components/layout";
import { Card } from "@/components/ui";
import {
  MapControls,
  MapFilters,
  MapView,
  ReportDetailPanel,
} from "@/components/maps";
import { useCategories, useReports } from "@/hooks";
import { filterReportsByPriority } from "@/features/reports/reportPresentation";
import {
  filterReportsByText,
  getReportsWithCoordinates,
} from "@/features/map/mapHelpers";
import type { Report, ReportPriority } from "@/types";
import type {
  MapBaseLayer,
  MapViewMode,
} from "@/components/maps/EnvironmentalMap";

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
  const [searchText, setSearchText] = useState("");
  const [hideResolved, setHideResolved] = useState(false);
  const [viewMode, setViewMode] = useState<MapViewMode>("markers");
  const [baseLayer, setBaseLayer] = useState<MapBaseLayer>("map");
  const [focusCoords, setFocusCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [fitKey, setFitKey] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const visibleReports = useMemo(() => {
    let list = filterReportsByPriority(filteredReports, selectedPriority);
    list = filterReportsByText(list, searchText);

    if (hideResolved) {
      list = list.filter((report) => report.status !== "resolved");
    }

    return getReportsWithCoordinates(list);
  }, [filteredReports, selectedPriority, searchText, hideResolved]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Mapa ambiental</h1>
          <p className="text-slate-600">
            Visualiza los reportes ambientales según su ubicación.
          </p>
        </div>

        <MapControls
          viewMode={viewMode}
          baseLayer={baseLayer}
          onViewModeChange={setViewMode}
          onBaseLayerChange={setBaseLayer}
          onFocus={(coords) => setFocusCoords({ ...coords })}
          onRecenter={() => setFitKey((key) => key + 1)}
        />

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4">
            <Card className="h-fit">
              <MapFilters
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedStatus={selectedStatus}
                selectedPriority={selectedPriority}
                searchText={searchText}
                hideResolved={hideResolved}
                onCategoryChange={setSelectedCategoryId}
                onStatusChange={setSelectedStatus}
                onPriorityChange={setSelectedPriority}
                onSearchTextChange={setSearchText}
                onHideResolvedChange={setHideResolved}
                totalVisibles={visibleReports.length}
              />
            </Card>

            {selectedReport ? (
              <ReportDetailPanel
                report={selectedReport}
                categories={categories}
                onClose={() => setSelectedReport(null)}
              />
            ) : null}
          </div>

          {isLoading ? (
            <Card className="flex h-[520px] items-center justify-center text-slate-500">
              Cargando reportes...
            </Card>
          ) : (
            <MapView
              reports={visibleReports}
              categories={categories}
              viewMode={viewMode}
              baseLayer={baseLayer}
              focusCoords={focusCoords}
              fitKey={fitKey}
              onSelectReport={setSelectedReport}
            />
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
