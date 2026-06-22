import Link from "next/link";
import { FileText, Leaf, MapPin } from "lucide-react";

import { EcoIllustration } from "./EcoIllustration";

export function Hero() {
  return (
    <section className="grid items-center gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-16">
      <div className="space-y-7">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          <Leaf className="h-4 w-4" />
          Plataforma de reportes ambientales
        </span>

        <div className="space-y-5">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Monitorea hoy,{" "}
            <span className="text-green-600">transforma mañana.</span>
          </h1>

          <p className="max-w-xl text-lg leading-8 text-slate-600">
            GreenPulse es la plataforma para reportar y dar seguimiento a las
            problemáticas ambientales de tu campus y comunidad. Simple, visual y
            colaborativa.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/reports"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-sm font-medium text-white transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <FileText className="h-4 w-4" />
            Crear reporte
          </Link>

          <Link
            href="/map"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            <MapPin className="h-4 w-4" />
            Explorar mapa
          </Link>
        </div>
      </div>

      <div className="relative">
        <EcoIllustration className="h-auto w-full max-w-lg md:ml-auto" />
      </div>
    </section>
  );
}