"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  RefreshCcw,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useCategories } from "@/hooks";
import type { ReportPriority, WasteRecognitionResult } from "@/types";
import { saveRecognitionReportDraft } from "@/utils";

import { RecognitionResultCard } from "./RecognitionResultCard";

type FacingMode = "user" | "environment";

async function analyzeWasteImage(
  imageDataUrl: string
): Promise<WasteRecognitionResult> {
  const response = await fetch("/api/waste-recognition", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageDataUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo analizar la imagen.");
  }

  return response.json() as Promise<WasteRecognitionResult>;
}

export function CameraRecognition() {
  const router = useRouter();
  const { categories } = useCategories();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<WasteRecognitionResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback((updateState = true) => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (updateState) {
      setIsCameraActive(false);
    }
  }, []);

  const startCamera = useCallback(
    async (targetFacingMode?: FacingMode) => {
      try {
        const selectedFacingMode = targetFacingMode ?? facingMode;

        setError(null);
        setCapturedImage(null);
        setResult(null);

        stopCamera(false);

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Tu navegador no permite acceso a cámara.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: selectedFacingMode,
            },
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraActive(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo activar la cámara.";

        setError(message);
        setIsCameraActive(false);
      }
    },
    [facingMode, stopCamera]
  );

  const switchCamera = async () => {
    const nextFacingMode: FacingMode =
      facingMode === "environment" ? "user" : "environment";

    setFacingMode(nextFacingMode);

    if (isCameraActive) {
      await startCamera(nextFacingMode);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("No se pudo capturar la imagen.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.85);

    setCapturedImage(imageDataUrl);
    setResult(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) {
      setError("Primero toma una foto del residuo.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      const recognitionResult = await analyzeWasteImage(capturedImage);
      setResult(recognitionResult);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo analizar el residuo.";

      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  function getSuggestedCategoryId() {
    const wasteCategory = categories.find((category) => {
      const normalizedName = category.name.toLowerCase();

      return (
        category.id === "waste" ||
        normalizedName.includes("residuo") ||
        normalizedName.includes("basura") ||
        normalizedName.includes("desecho")
      );
    });

    return wasteCategory?.id ?? "";
  }

  function getPriorityFromResult(
    recognitionResult: WasteRecognitionResult
  ): ReportPriority {
    if (
      recognitionResult.wasteType === "hazardous" ||
      recognitionResult.wasteType === "electronic"
    ) {
      return "high";
    }

    if (
      recognitionResult.confidence === "low" ||
      recognitionResult.wasteType === "not_identified"
    ) {
      return "low";
    }

    return "medium";
  }

  const handleCreateReportFromRecognition = () => {
    if (!result || !capturedImage) {
      return;
    }

    saveRecognitionReportDraft({
      title: `Residuo detectado: ${result.objectName}`,
      description: `Reporte generado desde el módulo de reconocimiento ambiental.

Tipo de residuo detectado: ${result.wasteTypeLabel}
Objeto observado: ${result.objectName}
Confianza del reconocimiento: ${result.confidence}

Explicación:
${result.explanation}

Recomendación:
${result.recommendation}

Disposición sugerida:
${result.binSuggestion}

Tip ambiental:
${result.environmentalTip}`,
      categoryId: getSuggestedCategoryId(),
      priority: getPriorityFromResult(result),
      status: "pending",
      image: capturedImage,
      createdAt: new Date().toISOString(),
    });

    router.push("/reports/new?from=recognition");
  };

  useEffect(() => {
    return () => {
      stopCamera(false);
    };
  }, [stopCamera]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <ScanSearch className="h-8 w-8" />
              </div>

              <div>
                <p className="text-sm text-green-100">EcoScan</p>
                <h2 className="text-2xl font-bold">
                  Reconocimiento de residuos
                </h2>
                <p className="mt-1 text-sm text-green-50">
                  Toma una foto de un residuo para clasificarlo y recibir una
                  recomendación ambiental.
                </p>
              </div>
            </div>
          </div>

          <CardContent className="space-y-4 p-5">
            <div className="relative overflow-hidden rounded-3xl bg-slate-950">
              {capturedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage}
                  alt="Residuo capturado"
                  className="h-[28rem] w-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-[28rem] w-full object-cover"
                />
              )}

              {!isCameraActive && !capturedImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center text-white">
                  <Camera className="mb-4 h-14 w-14 text-green-400" />
                  <h3 className="text-xl font-semibold">
                    Cámara no activada
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-slate-300">
                    Activa la cámara para capturar una imagen del residuo que
                    deseas analizar.
                  </p>
                </div>
              ) : null}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {!isCameraActive ? (
                <Button onClick={() => void startCamera()}>
                  <Camera className="mr-2 h-4 w-4" />
                  Activar cámara
                </Button>
              ) : null}

              {isCameraActive && !capturedImage ? (
                <>
                  <Button onClick={capturePhoto}>
                    <Camera className="mr-2 h-4 w-4" />
                    Tomar foto
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void switchCamera()}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Cambiar cámara
                  </Button>
                </>
              ) : null}

              {capturedImage ? (
                <>
                  <Button
                    onClick={() => void handleAnalyze()}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ScanSearch className="mr-2 h-4 w-4" />
                    )}
                    {isAnalyzing ? "Analizando..." : "Analizar residuo"}
                  </Button>

                  <Button type="button" variant="outline" onClick={retakePhoto}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Tomar otra foto
                  </Button>
                </>
              ) : null}

              {isCameraActive ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => stopCamera()}
                >
                  Apagar cámara
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="space-y-4">
            <RecognitionResultCard result={result} />

            <Button className="w-full" onClick={handleCreateReportFromRecognition}>
              Crear reporte con este residuo
            </Button>

            <p className="text-xs leading-5 text-slate-500">
              Se abrirá el formulario de reportes con la foto y los detalles del
              reconocimiento. La ubicación no se rellenará automáticamente para
              respetar el selector de ubicación del formulario.
            </p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de uso</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-3 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <p>
                  La imagen solo se envía para análisis cuando presionas
                  “Analizar residuo”. No se analiza video en tiempo real.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <p className="font-semibold text-slate-900">
                  Para mejores resultados:
                </p>
                <p>1. Centra el objeto en la cámara.</p>
                <p>2. Usa buena iluminación.</p>
                <p>3. Evita fondos con demasiados objetos.</p>
                <p>4. Toma la foto de cerca, pero sin desenfocar.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}