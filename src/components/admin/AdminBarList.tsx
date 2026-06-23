import { Card, CardHeader, CardTitle } from "@/components/ui";
import type { AdminChartDatum } from "@/types";

interface AdminBarListProps {
  title: string;
  data: AdminChartDatum[];
  emptyMessage?: string;
}

export function AdminBarList({
  title,
  data,
  emptyMessage = "Aún no hay datos suficientes para mostrar.",
}: AdminBarListProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 0);
  const shouldScroll = data.length > 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {data.length === 0 || maxValue === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <div
          className={
            shouldScroll
              ? "max-h-[460px] space-y-4 overflow-y-auto pr-2"
              : "space-y-4"
          }
        >
          {data.map((item) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-700">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-slate-500">{item.value}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${Math.max(percentage, 6)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
