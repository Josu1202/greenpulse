"use client";

import { Card } from "@/components/ui";

interface KpiCardProps {
  label: string;
  value: number;
  accentColor?: string;
  hint?: string;
}

export function KpiCard({
  label,
  value,
  accentColor = "#16a34a",
  hint,
}: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden">
      {/* Barra de acento lateral según el indicador */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: accentColor }}
      />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </Card>
  );
}
