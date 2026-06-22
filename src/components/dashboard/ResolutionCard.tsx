"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { ResolutionStats } from "@/features/dashboard/dashboardStats";

interface ResolutionCardProps {
  resolution: ResolutionStats;
}

function formatearTiempo(resolution: ResolutionStats): string {
  if (resolution.tiempoPromedioHoras === null) {
    return "Sin datos suficientes";
  }

  if (
    resolution.tiempoPromedioDias !== null &&
    resolution.tiempoPromedioDias >= 1
  ) {
    const dias = resolution.tiempoPromedioDias;
    return `${dias} ${dias === 1 ? "día" : "días"}`;
  }

  const horas = resolution.tiempoPromedioHoras;
  return `${horas} ${horas === 1 ? "hora" : "horas"}`;
}

export function ResolutionCard({ resolution }: ResolutionCardProps) {
  const tiempo = formatearTiempo(resolution);

  return (
    <Card className="relative overflow-hidden">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: "#22c55e" }}
      />

      <CardHeader>
        <CardTitle>Resolución</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-900">
              {resolution.tasaResolucion}%
            </span>
            <span className="pb-1 text-sm text-slate-500">
              tasa de resolución
            </span>
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${resolution.tasaResolucion}%` }}
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {resolution.resueltos} de {resolution.total} reportes resueltos.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-500">Tiempo promedio de resolución</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{tiempo}</p>
          {resolution.muestraConTiempo > 0 ? (
            <p className="mt-1 text-xs text-slate-400">
              Calculado sobre {resolution.muestraConTiempo} reporte(s) resuelto(s).
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Se calcula cuando haya reportes que pasen a “Resuelto”.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
