"use client";

import { useMemo, useState } from "react";

import { Select } from "@/components/ui";
import type { ReportActivity, ReportPriority, ReportStatus } from "@/types";
import {
  getPriorityLabel,
  getStatusLabel,
} from "@/features/reports/reportPresentation";

type ActivitySortOrder = "newest" | "oldest";

interface ReportActivityListProps {
  activities: ReportActivity[];
  isLoading?: boolean;
}

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getActivityTitle(activity: ReportActivity): string {
  if (activity.type === "comment") {
    return "Comentario";
  }

  return "Avance";
}

function getStatusText(
  previousStatus?: ReportStatus,
  newStatus?: ReportStatus
): string | null {
  if (!newStatus) {
    return null;
  }

  if (!previousStatus) {
    return `Estado definido: ${getStatusLabel(newStatus)}`;
  }

  if (previousStatus === newStatus) {
    return `Estado sin cambio: ${getStatusLabel(newStatus)}`;
  }

  return `Estado: ${getStatusLabel(previousStatus)} → ${getStatusLabel(newStatus)}`;
}

function getPriorityText(
  previousPriority?: ReportPriority,
  newPriority?: ReportPriority
): string | null {
  if (!newPriority) {
    return null;
  }

  if (!previousPriority) {
    return `Prioridad definida: ${getPriorityLabel(newPriority)}`;
  }

  if (previousPriority === newPriority) {
    return `Prioridad sin cambio: ${getPriorityLabel(newPriority)}`;
  }

  return `Prioridad: ${getPriorityLabel(previousPriority)} → ${getPriorityLabel(newPriority)}`;
}

export function ReportActivityList({
  activities,
  isLoading = false,
}: ReportActivityListProps) {
  const [sortOrder, setSortOrder] = useState<ActivitySortOrder>("newest");

  const orderedActivities = useMemo(() => {
    return [...activities].sort((first, second) => {
      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();

      if (sortOrder === "newest") {
        return secondTime - firstTime;
      }

      return firstTime - secondTime;
    });
  }, [activities, sortOrder]);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando historial...</p>;
  }

  if (activities.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
        Este reporte aún no tiene comentarios ni avances registrados.
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Historial del reporte
          </p>
          <p className="text-xs text-slate-500">
            Se muestran hasta 3 actividades a la vez. Usa scroll para ver más.
          </p>
        </div>

        <Select
          label="Orden"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as ActivitySortOrder)}
          className="h-9 sm:w-48"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
        </Select>
      </div>

      <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-2">
        {orderedActivities.map((activity) => {
          const statusText = getStatusText(
            activity.previousStatus,
            activity.newStatus
          );
          const priorityText = getPriorityText(
            activity.previousPriority,
            activity.newPriority
          );

          return (
            <article
              key={activity.id}
              className="min-h-36 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                {activity.userProfileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activity.userProfileImage}
                    alt={activity.userName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                    {activity.userName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part.charAt(0))
                      .join("")
                      .toUpperCase() || "GP"}
                  </span>
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {getActivityTitle(activity)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {activity.userName} · {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>

                  {activity.comment ? (
                    <p className="whitespace-pre-line text-sm text-slate-700">
                      {activity.comment}
                    </p>
                  ) : null}

                  {activity.type === "progress_update" ? (
                    <div className="grid gap-2 md:grid-cols-2">
                      {statusText ? (
                        <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
                          {statusText}
                        </p>
                      ) : null}

                      {priorityText ? (
                        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                          {priorityText}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {activity.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activity.image}
                      alt={
                        activity.type === "comment"
                          ? "Imagen del comentario"
                          : "Imagen del avance"
                      }
                      className="max-h-64 rounded-xl border border-slate-200 object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
