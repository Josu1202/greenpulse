import { Badge, Card, CardHeader, CardTitle } from "@/components/ui";
import type { AdminRecentEvent } from "@/types";

interface AdminRecentActivityProps {
  events: AdminRecentEvent[];
}

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

export function AdminRecentActivity({ events }: AdminRecentActivityProps) {
  return (
    <Card className="min-h-[360px]">
      <CardHeader>
        <CardTitle>Actividad reciente del sistema</CardTitle>
      </CardHeader>

      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          Aún no hay actividad para mostrar.
        </p>
      ) : (
        <div className="max-h-[340px] overflow-y-auto pr-2">
          <div className="divide-y divide-slate-100">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="pt-0.5">
                  <Badge variant={event.tone ?? "default"}>{event.title}</Badge>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-slate-700">
                    {event.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(event.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
