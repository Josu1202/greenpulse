import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import type {
  RecognitionConfidence,
  WasteRecognitionResult,
  WasteType,
} from "@/types";
import { getWasteRecommendation } from "@/utils";

interface WasteRecognitionRequest {
  imageDataUrl?: string;
}

interface GeminiWasteResponse {
  wasteType?: WasteType;
  objectName?: string;
  confidence?: RecognitionConfidence;
  explanation?: string;
}

const allowedWasteTypes: WasteType[] = [
  "plastic",
  "paper",
  "cardboard",
  "glass",
  "metal",
  "organic",
  "electronic",
  "textile",
  "hazardous",
  "mixed",
  "not_identified",
];

const allowedConfidence: RecognitionConfidence[] = ["low", "medium", "high"];

function parseImageDataUrl(imageDataUrl: string) {
  const match = imageDataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);

  if (!match) {
    throw new Error("Formato de imagen inválido.");
  }

  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  const base64Data = match[2];

  return {
    mimeType,
    base64Data,
  };
}

function extractJson(text: string): GeminiWasteResponse {
  const cleanedText = text.replaceAll("```json", "").replaceAll("```", "").trim();
  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("La IA no devolvió JSON válido.");
  }

  return JSON.parse(cleanedText.slice(start, end + 1)) as GeminiWasteResponse;
}

function buildPrompt() {
  return `
Eres un asistente de clasificación de residuos para GreenPulse.

Analiza la imagen y clasifica el residuo principal observado.

Debes responder únicamente en JSON válido, sin markdown, sin explicación externa.

Categorías permitidas:
- plastic
- paper
- cardboard
- glass
- metal
- organic
- electronic
- textile
- hazardous
- mixed
- not_identified

Reglas:
- Si ves una botella plástica, bolsa plástica, empaque plástico o envase plástico: usa plastic.
- Si ves papel: usa paper.
- Si ves cartón o caja: usa cardboard.
- Si ves botella o frasco de vidrio: usa glass.
- Si ves lata o metal: usa metal.
- Si ves restos de comida, cáscaras, hojas o residuos biodegradables: usa organic.
- Si ves dispositivo, cable, batería o componente electrónico: usa electronic.
- Si ves ropa o tela: usa textile.
- Si parece residuo delicado, químico, batería o algo que requiere manejo especial: usa hazardous.
- Si hay varios residuos mezclados y no se puede separar uno principal: usa mixed.
- Si no puedes identificar el objeto con claridad: usa not_identified.

Formato exacto:
{
  "wasteType": "plastic",
  "objectName": "Botella plástica",
  "confidence": "high",
  "explanation": "La imagen muestra un envase plástico, por eso se clasifica como plástico."
}
`;
}

function normalizeWasteType(value?: string): WasteType {
  if (allowedWasteTypes.includes(value as WasteType)) {
    return value as WasteType;
  }

  return "not_identified";
}

function normalizeConfidence(value?: string): RecognitionConfidence {
  if (allowedConfidence.includes(value as RecognitionConfidence)) {
    return value as RecognitionConfidence;
  }

  return "low";
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const body = (await request.json()) as WasteRecognitionRequest;
    const imageDataUrl = body.imageDataUrl;

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "No se recibió una imagen para analizar." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      const fallbackRecommendation = getWasteRecommendation("not_identified");

      const fallbackResult: WasteRecognitionResult = {
        wasteType: "not_identified",
        wasteTypeLabel: fallbackRecommendation.wasteTypeLabel,
        objectName: "No identificado",
        confidence: "low",
        explanation:
          "No hay una GEMINI_API_KEY configurada, por lo que no se pudo analizar la imagen con IA.",
        recommendation: fallbackRecommendation.recommendation,
        binSuggestion: fallbackRecommendation.binSuggestion,
        environmentalTip: fallbackRecommendation.environmentalTip,
        source: "fallback",
      };

      return NextResponse.json(fallbackResult);
    }

    const { mimeType, base64Data } = parseImageDataUrl(imageDataUrl);

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          text: buildPrompt(),
        },
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ],
      config: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    const rawText = response.text ?? "";
    const parsedResult = extractJson(rawText);

    const wasteType = normalizeWasteType(parsedResult.wasteType);
    const confidence = normalizeConfidence(parsedResult.confidence);
    const recommendation = getWasteRecommendation(wasteType);

    const result: WasteRecognitionResult = {
      wasteType,
      wasteTypeLabel: recommendation.wasteTypeLabel,
      objectName: parsedResult.objectName ?? recommendation.wasteTypeLabel,
      confidence,
      explanation:
        parsedResult.explanation ??
        "La clasificación fue generada con base en la imagen capturada.",
      recommendation: recommendation.recommendation,
      binSuggestion: recommendation.binSuggestion,
      environmentalTip: recommendation.environmentalTip,
      source: "gemini",
    };

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo analizar la imagen.";

    const recommendation = getWasteRecommendation("not_identified");

    const result: WasteRecognitionResult = {
      wasteType: "not_identified",
      wasteTypeLabel: recommendation.wasteTypeLabel,
      objectName: "No identificado",
      confidence: "low",
      explanation: message,
      recommendation: recommendation.recommendation,
      binSuggestion: recommendation.binSuggestion,
      environmentalTip: recommendation.environmentalTip,
      source: "fallback",
    };

    return NextResponse.json(result);
  }
}