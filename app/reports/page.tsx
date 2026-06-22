"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { MainLayout, ProtectedRoute } from "@/components/layout";
import { Button, ConfirmDialog } from "@/components/ui";
import { ReportFilters, ReportTable, ReportToolbar } from "@/components/reports";
import { useCategories, useReports } from "@/hooks";
import {
  filterReportsByPriority,
  searchReports,
  sortReports,
  type ReportSortOption,
} from "@/features/reports/reportPresentation";
import {
  buildReportsFilename,
  downloadCsv,
  reportsToCsv,
} from "@/features/reports/reportExport";
import type { ReportPriority } from "@/types";

const REPORTS_PER_PAGE = 5;
const PAGINATION_THRESHOLD = 10;

export default function ReportsPage() {
  const {
    filteredReports,
    selectedStatus,
    selectedCategoryId,
    isLoading,
    error,
    currentUser,
    setSelectedStatus,
    setSelectedCategoryId,
    changeReportStatus,
    removeReport,
    loadReports,
  } = useReports();

  const { categories } = useCategories();

  const [selectedPriority, setSelectedPriority] = useState<
    ReportPriority | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<ReportSortOption>("recent");
  const [onlyMine, setOnlyMine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleReports = useMemo(() => {
    let list = filterReportsByPriority(filteredReports, selectedPriority);
    list = searchReports(list, searchQuery);

    if (onlyMine && currentUser) {
      list = list.filter((report) => report.userId === currentUser.id);
    }

    return sortReports(list, sortOption);
  }, [
    filteredReports,
    selectedPriority,
    searchQuery,
    onlyMine,
    currentUser,
    sortOption,
  ]);

  const shouldPaginate = visibleReports.length > PAGINATION_THRESHOLD;
  const totalPages = shouldPaginate
    ? Math.ceil(visibleReports.length / REPORTS_PER_PAGE)
    : 1;

  const paginatedReports = useMemo(() => {
    if (!shouldPaginate) {
      return visibleReports;
    }

    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    return visibleReports.slice(startIndex, startIndex + REPORTS_PER_PAGE);
  }, [currentPage, shouldPaginate, visibleReports]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedStatus,
    selectedCategoryId,
    selectedPriority,
    searchQuery,
    onlyMine,
    sortOption,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleExport = () => {
    const csv = reportsToCsv(visibleReports, categories);
    downloadCsv(buildReportsFilename(), csv);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    try {
      setIsDeleting(true);
      await removeReport(pendingDeleteId);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleReopen = async (id: string) => {
    const confirmed = window.confirm(
      "¿Reabrir este reporte? Volverá a permitir comentarios, avances y edición del reporte original."
    );

    if (!confirmed) {
      return;
    }

    await changeReportStatus(id, "in_review");
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-950">Reportes</h1>
              <p className="text-slate-600">
                Consulta todos los reportes, agrega avances y da seguimiento al
                historial de cada problema ambiental.
              </p>
            </div>

            <Link href="/reports/new">
              <Button variant="primary">+ Nuevo reporte</Button>
            </Link>
          </div>

          <ReportFilters
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            selectedStatus={selectedStatus}
            selectedPriority={selectedPriority}
            onCategoryChange={setSelectedCategoryId}
            onStatusChange={setSelectedStatus}
            onPriorityChange={setSelectedPriority}
          />

          <ReportToolbar
            searchQuery={searchQuery}
            sortOption={sortOption}
            onlyMine={onlyMine}
            canFilterMine={Boolean(currentUser)}
            canExport={visibleReports.length > 0}
            onSearchChange={setSearchQuery}
            onSortChange={setSortOption}
            onOnlyMineChange={setOnlyMine}
            onExport={handleExport}
          />

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <p className="py-8 text-center text-slate-500">
              Cargando reportes...
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span>
                  Mostrando {paginatedReports.length} de {visibleReports.length}{" "}
                  reporte(s)
                </span>

                {shouldPaginate ? (
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                ) : null}
              </div>

              <ReportTable
                reports={paginatedReports}
                categories={categories}
                currentUserId={currentUser?.id}
                onDelete={(id) => setPendingDeleteId(id)}
                onReopen={handleReopen}
                onRefreshReports={loadReports}
              />

              {shouldPaginate ? (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Anterior
                  </Button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                  >
                    Siguiente
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <ConfirmDialog
          open={pendingDeleteId !== null}
          title="¿Eliminar este reporte?"
          description="Solo el dueño puede hacerlo. También se eliminará todo su historial de avances y comentarios. Esta acción no se puede deshacer."
          confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
