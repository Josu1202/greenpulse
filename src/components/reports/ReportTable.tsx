"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, MapPin, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui";
import type { Category, Report } from "@/types";
import { createGoogleMapsUrl } from "@/utils/googleMaps";
import { useReportActivities } from "@/hooks/useReportActivities";
import {
  formatReportDate,
  getCategoryName,
} from "@/features/reports/reportPresentation";
import { PriorityBadge, StatusBadge } from "./ReportBadges";
import { ReportActivityForm } from "./ReportActivityForm";
import { ReportActivityList } from "./ReportActivityList";

interface ReportTableProps {
  reports: Report[];
  categories: Category[];
  currentUserId?: string;
  onDelete: (id: string) => Promise<void> | void;
  onReopen: (id: string) => Promise<void> | void;
  onRefreshReports: () => Promise<void> | void;
}

interface ReportCardProps extends ReportTableProps {
  report: Report;
}

function ReportCard({
  report,
  categories,
  currentUserId,
  onDelete,
  onReopen,
  onRefreshReports,
}: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    activities,
    isLoading: isLoadingActivities,
    addComment,
    addProgressUpdate,
  } = useReportActivities(report.id);

  const isOwner = currentUserId === report.userId;
  const isCompleted = report.status === "resolved";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-3">
            {(() => {
              const gallery = report.images?.length
                ? report.images
                : report.image
                  ? [report.image]
                  : [];
              const cover = gallery[0];
              const extra = gallery.length - 1;

              return cover ? (
                <div className="relative h-20 w-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover}
                    alt={report.title}
                    className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                  />
                  {extra > 0 ? (
                    <span className="absolute bottom-1 right-1 rounded bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      +{extra}
                    </span>
                  ) : null}
                </div>
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-semibold text-green-700">
                  GP
                </span>
              );
            })()}

            <div className="min-w-0 space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {report.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {report.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{getCategoryName(categories, report.categoryId)}</span>
                <span>·</span>
                <span>{formatReportDate(report.createdAt)}</span>
                {isOwner ? (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 font-medium text-green-700">
                    Tu reporte
                  </span>
                ) : null}
                {isCompleted ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                    Bloqueado hasta reapertura
                  </span>
                ) : null}
              </div>

              <a
                href={createGoogleMapsUrl(report.latitude, report.longitude)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-green-700 hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                Ver ubicación original
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {activities.length} actividad(es)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOwner && !isCompleted ? (
              <>
                <Link href={`/reports/new?id=${report.id}`}>
                  <Button variant="outline" size="sm">
                    Editar original
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => void onDelete(report.id)}
                >
                  Eliminar
                </Button>
              </>
            ) : null}

            {isOwner && isCompleted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void onReopen(report.id)}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reabrir
              </Button>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((value) => !value)}
              className="gap-1"
            >
              {isExpanded ? (
                <>
                  Ocultar historial <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Ver historial <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-4 md:p-5">
          {isCompleted ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Este reporte está completado. No se pueden agregar nuevos
              comentarios ni avances. {isOwner ? "Puedes reabrirlo desde el botón superior." : "Solo el autor puede reabrirlo."}
            </div>
          ) : (
            <ReportActivityForm
              key={`${report.status}-${report.priority}`}
              currentStatus={report.status}
              currentPriority={report.priority}
              onSubmit={async (data) => {
                if (data.activityType === "comment") {
                  await addComment({
                    comment: data.comment,
                    image: data.image,
                  });
                } else {
                  await addProgressUpdate({
                    comment: data.comment,
                    status: data.status,
                    priority: data.priority,
                    image: data.image,
                  });

                  await onRefreshReports();
                }
              }}
            />
          )}

          <ReportActivityList
            activities={activities}
            isLoading={isLoadingActivities}
          />
        </div>
      ) : null}
    </article>
  );
}

export function ReportTable({
  reports,
  categories,
  currentUserId,
  onDelete,
  onReopen,
  onRefreshReports,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-500">
          No hay reportes que coincidan con los filtros seleccionados.
        </p>
        <Link
          href="/reports/new"
          className="mt-3 inline-block text-sm font-medium text-green-700 hover:underline"
        >
          Crear el primer reporte →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          reports={reports}
          categories={categories}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onReopen={onReopen}
          onRefreshReports={onRefreshReports}
        />
      ))}
    </div>
  );
}
