"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { ImpactStats } from "@/features/dashboard/dashboardStats";

interface ImpactCardProps {
  impact: ImpactStats;
}

export function ImpactCard({ impact }: ImpactCardProps) {
  const sinDatos = impact.impactoTotal === 0;

  return (
    <Card className="relative overflow-hidden">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: "#0f766e" }}
      />

      <CardHeader>
        <CardTitle>Índice de impacto ambiental</CardTitle>
      </CardHeader>

      {sinDatos ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Aún no hay reportes para calcular el impacto.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-900">
              {impact.indiceActivo}
            </span>
            <span className="pb-1 text-sm text-slate-500">
              presión ambiental activa
            </span>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Impacto mitigado</span>
              <span className="font-medium text-slate-700">
                {impact.porcentajeMitigado}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${impact.porcentajeMitigado}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {impact.impactoMitigado} de {impact.impactoTotal} puntos de impacto
              ya resueltos.
            </p>
          </div>

          {impact.detalle.length > 0 ? (
            <ul className="space-y-1.5 border-t border-slate-100 pt-3">
              {impact.detalle.slice(0, 5).map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-slate-600">
                    <span
                      aria-hidden
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium text-slate-800">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </Card>
  );
}
