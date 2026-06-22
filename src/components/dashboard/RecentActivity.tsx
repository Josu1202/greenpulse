"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { DashboardEvent } from "@/features/dashboard/dashboardActivity";

interface RecentActivityProps {
  events: DashboardEvent[];
}

// Verbo/etiqueta corta según el tipo de evento.
const KIND_LABEL: Record<DashboardEvent["kind"], string> = {
  created: "Nuevo reporte",
  comment: "Comentario",
  status: "Cambio de estado",
  priority: "Cambio de prioridad",
  progress: "Avance",
};

function tiempoRelativo(isoDate: string): string {
  const fecha = new Date(isoDate);

  if (Number.isNaN(fecha.getTime())) {
    return "";
  }

  const segundos = Math.floor((Date.now() - fecha.getTime()) / 1000);

  if (segundos < 60) {
    return "hace un momento";
  }

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) {
    return `hace ${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return `hace ${horas} h`;
  }

  const dias = Math.floor(horas / 24);
  if (dias < 30) {
    return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
  }

  const day = String(fecha.getDate()).padStart(2, "0");
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${fecha.getFullYear()}`;
}

export function RecentActivity({ events = [] }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>

      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No hay actividad reciente.
        </p>
      ) : (
        <ul className="space-y-1">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50"
            >
              <span
                aria-hidden
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: event.categoryColor }}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">
                  <span className="font-medium">{event.userName}</span>{" "}
                  {event.description}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {KIND_LABEL[event.kind]} · {event.reportTitle} ·{" "}
                  {event.categoryName}
                </p>
              </div>

              <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
                {tiempoRelativo(event.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
