import { Activity, BarChart3, MapPin, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Send,
    title: "Reporta fácilmente",
    description:
      "Registra residuos, contaminación, agua, vegetación o ruido en segundos.",
  },
  {
    icon: Activity,
    title: "Seguimiento transparente",
    description:
      "Sigue cada reporte por su estado: pendiente, en revisión o resuelto.",
  },
  {
    icon: BarChart3,
    title: "Impacto medible",
    description:
      "Indicadores y estadísticas que muestran el avance ambiental con datos reales.",
  },
  {
    icon: MapPin,
    title: "Mapa interactivo",
    description:
      "Visualiza reportes y zonas prioritarias geolocalizados en el mapa.",
  },
];

export function FeatureGrid() {
  return (
    <section className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, description }) => (
        <Card key={title} className="transition-shadow hover:shadow-md">
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <Icon className="h-5 w-5" />
          </span>

          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </Card>
      ))}
    </section>
  );
}