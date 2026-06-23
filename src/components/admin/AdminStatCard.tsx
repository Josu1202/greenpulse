import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import { cn } from "@/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  accent?: "green" | "blue" | "amber" | "purple" | "slate";
}

const accentClasses = {
  green: "border-l-green-500",
  blue: "border-l-sky-500",
  amber: "border-l-amber-500",
  purple: "border-l-purple-500",
  slate: "border-l-slate-500",
};

export function AdminStatCard({
  label,
  value,
  description,
  icon,
  accent = "green",
}: AdminStatCardProps) {
  return (
    <Card className={cn("border-l-4", accentClasses[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
          {description ? (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-xl bg-slate-100 p-2 text-slate-600">{icon}</div>
        ) : null}
      </div>
    </Card>
  );
}
