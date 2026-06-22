"use client";

import { CheckCircle2, Info, Recycle, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { WasteRecognitionResult } from "@/types";

interface RecognitionResultCardProps {
  result: WasteRecognitionResult;
}

function getConfidenceLabel(confidence: WasteRecognitionResult["confidence"]) {
  if (confidence === "high") {
    return "Alta";
  }

  if (confidence === "medium") {
    return "Media";
  }

  return "Baja";
}

export function RecognitionResultCard({ result }: RecognitionResultCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Recycle className="h-7 w-7" />
          </div>

          <div>
            <p className="text-sm text-green-100">Resultado del análisis</p>
            <h2 className="text-2xl font-bold">{result.wasteTypeLabel}</h2>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle>{result.objectName}</CardTitle>
        <CardDescription>
          Confianza: {getConfidenceLabel(result.confidence)} ·{" "}
          {result.source === "gemini" ? "Reconocimiento IA" : "Modo respaldo"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
            <Info className="h-4 w-4 text-green-600" />
            Explicación
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {result.explanation}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Recomendación
          </div>
          <p className="text-sm leading-6 text-green-800">
            {result.recommendation}
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 font-semibold text-amber-900">
            <Trash2 className="h-4 w-4 text-amber-600" />
            Disposición sugerida
          </div>
          <p className="text-sm leading-6 text-amber-800">
            {result.binSuggestion}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm leading-6 text-blue-800">
            <span className="font-semibold">Tip ambiental:</span>{" "}
            {result.environmentalTip}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}