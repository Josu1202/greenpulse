import { GoogleGenAI, Type } from "@google/genai";
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
  const match = imageDataUrl.match(
    /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/
  );

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

function buildPrompt() {
  return `
Eres un clasificador de residuos para GreenPulse.

Analiza la imagen y clasifica únicamente el residuo u objeto principal observado.

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

Criterios:
- Si ves una botella plástica, bolsa plástica, empaque plástico o envase plástico: usa plastic.
- Si ves papel: usa paper.
- Si ves cartón o una caja de cartón: usa cardboard.
- Si ves botella, vaso, frasco o pedazo de vidrio: usa glass.
- Si ves lata, aluminio o pieza metálica: usa metal.
- Si ves restos de comida, cáscaras, hojas o residuos biodegradables: usa organic.
- Si ves cargador, cable, batería, teléfono, componente electrónico o empaque claramente de un dispositivo electrónico: usa electronic.
- Si ves ropa o tela: usa textile.
- Si parece químico, batería dañada, envase contaminado o algo que requiere manejo especial: usa hazardous.
- Si hay varios residuos mezclados y no se puede separar uno principal: usa mixed.
- Si no puedes identificar el objeto con claridad: usa not_identified.

Debes responder en español en los campos textuales.
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

function safeParseGeminiResponse(text: string): GeminiWasteResponse {
  try {
    return JSON.parse(text) as GeminiWasteResponse;
  } catch {
    const cleanedText = text
      .replaceAll("```json", "")
      .replaceAll("```", "")
      .trim();

    const start = cleanedText.indexOf("{");
    const end = cleanedText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("La IA no devolvió JSON válido.");
    }

    return JSON.parse(cleanedText.slice(start, end + 1)) as GeminiWasteResponse;
  }
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
        temperature: 0.1,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wasteType: {
              type: Type.STRING,
              enum: allowedWasteTypes,
              description:
                "Categoría del residuo detectado. Debe ser una de las categorías permitidas.",
            },
            objectName: {
              type: Type.STRING,
              description:
                "Nombre breve del objeto detectado en español. Ejemplo: botella plástica, caja de cartón, cargador USB-C.",
            },
            confidence: {
              type: Type.STRING,
              enum: allowedConfidence,
              description:
                "Nivel de confianza del reconocimiento: low, medium o high.",
            },
            explanation: {
              type: Type.STRING,
              description:
                "Explicación breve en español de por qué se clasificó así.",
            },
          },
          required: ["wasteType", "objectName", "confidence", "explanation"],
        },
      },
    });

    const rawText = response.text ?? "";
    const parsedResult = safeParseGeminiResponse(rawText);

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