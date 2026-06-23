"use client";

import { Camera, Sparkles } from "lucide-react";

import { CameraRecognition } from "@/components/recognition";
import { DashboardLayout, ProtectedRoute } from "@/components/layout";

export default function RecognitionPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <section>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              <Camera className="h-4 w-4" />
              Reconocimiento ambiental
            </div>

            <h1 className="text-3xl font-bold text-slate-950">
              Reconocimiento de residuos
            </h1>

            <p className="mt-2 max-w-3xl text-slate-600">
              Usa la cámara del dispositivo para capturar residuos como plástico,
              papel, cartón, vidrio, metal u orgánicos. GreenPulse analizará la
              imagen y mostrará una recomendación de disposición responsable.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <Sparkles className="h-4 w-4" />
              El reconocimiento usa IA mediante una ruta interna de Next.js para
              proteger la clave del servicio.
            </div>
          </section>

          <CameraRecognition />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
