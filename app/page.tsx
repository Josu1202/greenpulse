import Link from "next/link";

import { MainLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

const features = [
  {
    title: "Reportes ambientales",
    description:
      "Registra incidencias como residuos, contaminación, agua, vegetación o ruido.",
  },
  {
    title: "Persistencia local",
    description:
      "Los datos se guardan en IndexedDB para conservar reportes al recargar la app.",
  },
  {
    title: "Mapa y dashboard",
    description:
      "Visualiza reportes geolocalizados y consulta indicadores ambientales.",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <section className="grid gap-8 py-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            MVP ambiental con Next.js + IndexedDB
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Reporta, visualiza y analiza problemas ambientales.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              GreenPulse permite registrar incidencias ambientales, guardarlas
              localmente, mostrarlas en un mapa y analizarlas mediante un
              dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-green-700"
            >
              Comenzar
            </Link>

            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Ver dashboard
            </Link>
          </div>
        </div>

        <Card className="border-green-100 bg-white">
          <CardHeader>
            <CardTitle>Flujo principal</CardTitle>
            <CardDescription>
              El recorrido básico del usuario dentro del MVP.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ol className="space-y-3 text-sm text-slate-600">
              <li>1. El usuario inicia sesión o se registra.</li>
              <li>2. Crea un reporte ambiental.</li>
              <li>3. El reporte se guarda en IndexedDB.</li>
              <li>4. Se muestra en mapa y dashboard.</li>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </MainLayout>
  );
}