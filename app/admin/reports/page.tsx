"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, RotateCcw, Trash2 } from "lucide-react";

import { AdminTabs } from "@/components/admin";
import { AdminRoute, DashboardLayout } from "@/components/layout";
import { Badge, Button, Card, Select, Input } from "@/components/ui";
import { useAdminReports, useCategories } from "@/hooks";
import {
  getCategoryName,
  getPriorityLabel,
  getStatusLabel,
} from "@/features/reports/reportPresentation";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";
import type { ReportActivity, ReportPriority, ReportStatus } from "@/types";

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getActivityTypeLabel(activity: ReportActivity): string {
  return activity.type === "comment" ? "Comentario" : "Avance";
}

function AdminReportsContent() {
  const {
    reports,
    users,
    isLoading,
    error,
    updateReport,
    hideReport,
    restoreReport,
    deleteReport,
    hideActivity,
    restoreActivity,
    deleteActivity,
    getActivitiesByReport,
  } = useAdminReports();
  const { categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const userNameById = useMemo(() => {
    return users.reduce<Record<string, string>>((accumulator, user) => {
      accumulator[user.id] = user.name;
      return accumulator;
    }, {});
  }, [users]);

  const visibleReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        (userNameById[report.userId] ?? "").toLowerCase().includes(query);

      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && report.isHidden !== true) ||
        (visibilityFilter === "hidden" && report.isHidden === true);

      return matchesSearch && matchesVisibility;
    });
  }, [reports, searchQuery, userNameById, visibilityFilter]);


  const handleCloseReport = async (id: string) => {
    const confirmed = window.confirm(
      "¿Cerrar este reporte como resuelto desde administración?"
    );

    if (!confirmed) {
      return;
    }

    await updateReport(id, { status: "resolved" });
  };

  const handleReopenReport = async (id: string) => {
    const confirmed = window.confirm(
      "¿Reabrir este reporte para que vuelva a recibir seguimiento?"
    );

    if (!confirmed) {
      return;
    }

    await updateReport(id, { status: "in_review" });
  };

  const handleHideReport = async (id: string) => {
    const reason = window.prompt(
      "Motivo para ocultar el reporte:",
      "Contenido no alineado al propósito del sitio."
    );

    if (reason === null) {
      return;
    }

    await hideReport(id, reason);
  };

  const handleDeleteReport = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar este reporte definitivamente? También se eliminarán sus comentarios y avances."
    );

    if (!confirmed) {
      return;
    }

    await deleteReport(id);
  };

  const handleHideActivity = async (id: string) => {
    const reason = window.prompt(
      "Motivo para ocultar el comentario o avance:",
      "Contenido no alineado al propósito del sitio."
    );

    if (reason === null) {
      return;
    }

    await hideActivity(id, reason);
  };

  const handleDeleteActivity = async (id: string) => {
    const confirmed = window.confirm(
      "¿Eliminar este comentario o avance definitivamente?"
    );

    if (!confirmed) {
      return;
    }

    await deleteActivity(id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Administración
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            Control de reportes
          </h1>
          <p className="mt-1 text-slate-600">
            Modera reportes, oculta contenido inapropiado y administra comentarios
            o avances del historial.
          </p>
        </div>

        <AdminTabs active="reports" />

        <Card className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Input
            label="Buscar"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Título, descripción o usuario"
          />

          <Select
            label="Visibilidad"
            value={visibilityFilter}
            onChange={(event) =>
              setVisibilityFilter(event.target.value as typeof visibilityFilter)
            }
          >
            <option value="all">Todos</option>
            <option value="visible">Visibles</option>
            <option value="hidden">Ocultos</option>
          </Select>
        </Card>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Cargando reportes...
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Mostrando {visibleReports.length} de {reports.length} reporte(s).
            </p>

            {visibleReports.map((report) => {
              const activities = getActivitiesByReport(report.id);
              const isExpanded = expandedReportId === report.id;

              return (
                <Card key={report.id} className={report.isHidden ? "bg-slate-50" : undefined}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-950">
                          {report.title}
                        </h2>
                        {report.isHidden ? <Badge variant="outline">Oculto</Badge> : null}
                      </div>

                      <p className="line-clamp-2 text-sm text-slate-600">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>Autor: {userNameById[report.userId] ?? "Usuario"}</span>
                        <span>•</span>
                        <span>{getCategoryName(categories, report.categoryId)}</span>
                        <span>•</span>
                        <span>{formatDate(report.createdAt)}</span>
                        <span>•</span>
                        <span>{activities.length} actividad(es)</span>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3 lg:w-[620px]">
                      <Select
                        label="Estado"
                        value={report.status}
                        onChange={(event) =>
                          void updateReport(report.id, {
                            status: event.target.value as ReportStatus,
                          })
                        }
                      >
                        {REPORT_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Select>

                      <Select
                        label="Prioridad"
                        value={report.priority}
                        onChange={(event) =>
                          void updateReport(report.id, {
                            priority: event.target.value as ReportPriority,
                          })
                        }
                      >
                        {REPORT_PRIORITIES.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </Select>

                      <Select
                        label="Categoría"
                        value={report.categoryId}
                        onChange={(event) =>
                          void updateReport(report.id, {
                            categoryId: event.target.value,
                          })
                        }
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {report.hiddenReason ? (
                    <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      Motivo de ocultamiento: {report.hiddenReason}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedReportId(isExpanded ? null : report.id)
                      }
                    >
                      {isExpanded ? "Ocultar historial" : "Ver historial"}
                    </Button>

                    {report.status === "resolved" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleReopenReport(report.id)}
                        className="gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reabrir
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleCloseReport(report.id)}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Cerrar
                      </Button>
                    )}

                    {report.isHidden ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void restoreReport(report.id)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Restaurar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleHideReport(report.id)}
                        className="gap-2"
                      >
                        <EyeOff className="h-4 w-4" />
                        Ocultar
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => void handleDeleteReport(report.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="font-semibold text-slate-900">
                        Comentarios y avances
                      </h3>

                      {activities.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">
                          Este reporte aún no tiene actividades.
                        </p>
                      ) : (
                        <div className="mt-3 max-h-96 space-y-3 overflow-y-auto pr-2">
                          {activities.map((activity) => (
                            <div
                              key={activity.id}
                              className="rounded-xl border border-slate-200 p-3"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant={activity.type === "comment" ? "info" : "success"}>
                                      {getActivityTypeLabel(activity)}
                                    </Badge>
                                    {activity.isHidden ? (
                                      <Badge variant="outline">Oculto</Badge>
                                    ) : null}
                                  </div>
                                  <p className="mt-2 text-sm text-slate-700">
                                    {activity.comment}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    {activity.userName} · {formatDate(activity.createdAt)}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {activity.isHidden ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => void restoreActivity(activity.id)}
                                    >
                                      Restaurar
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => void handleHideActivity(activity.id)}
                                    >
                                      Ocultar
                                    </Button>
                                  )}

                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => void handleDeleteActivity(activity.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </div>

                              {activity.type === "progress_update" ? (
                                <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                                  <span>
                                    Estado: {activity.previousStatus ? getStatusLabel(activity.previousStatus) : "-"} → {activity.newStatus ? getStatusLabel(activity.newStatus) : "-"}
                                  </span>
                                  <span>
                                    Prioridad: {activity.previousPriority ? getPriorityLabel(activity.previousPriority) : "-"} → {activity.newPriority ? getPriorityLabel(activity.newPriority) : "-"}
                                  </span>
                                </div>
                              ) : null}

                              {activity.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={activity.image}
                                  alt="Imagen de actividad"
                                  className="mt-3 h-32 w-32 rounded-lg border border-slate-200 object-cover"
                                />
                              ) : null}

                              {activity.hiddenReason ? (
                                <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
                                  Motivo: {activity.hiddenReason}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminReportsPage() {
  return (
    <AdminRoute>
      <AdminReportsContent />
    </AdminRoute>
  );
}
