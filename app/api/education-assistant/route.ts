import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

interface EducationAssistantRequest {
  lessonTitle?: string;
  lessonContent?: string;
  question?: string;
  mode?: "question" | "summary" | "keyIdeas" | "concepts" | "example" | "quizPrep";
}

function buildPrompt({
  lessonTitle,
  lessonContent,
  question,
  mode,
}: Required<EducationAssistantRequest>) {
  const modeInstruction: Record<Required<EducationAssistantRequest>["mode"], string> = {
    question:
      "Responde la pregunta del usuario usando únicamente el contenido de la lección.",
    summary:
      "Haz un resumen breve y claro de la lección en 4 a 6 líneas.",
    keyIdeas:
      "Extrae de 4 a 6 ideas clave de la lección en formato de lista.",
    concepts:
      "Explica los conceptos más importantes de la lección con lenguaje sencillo.",
    example:
        "Da un ejemplo práctico breve, completo y fácil de entender relacionado con la lección y con una comunidad educativa.",
    quizPrep:
      "Ayuda al estudiante a prepararse para las preguntas sin darle respuestas directas.",
  };

  return `
Eres un asistente educativo de GreenPulse.

Reglas obligatorias:
- Responde solo con base en la lección proporcionada.
- No inventes información que no esté relacionada con el texto.
- Usa lenguaje claro para estudiantes.
- No des respuestas directas de una evaluación.
- Si el texto no contiene suficiente información, dilo claramente.
- Responde en español.
- Responde con una extensión máxima aproximada de 120-200 palabras.
- Siempre termina la respuesta con una oración completa.

Título de la lección:
${lessonTitle}

Contenido de la lección:
${lessonContent}

Tarea:
${modeInstruction[mode]}

Pregunta o solicitud del usuario:
${question}
`;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        {
          answer: null,
          source: "fallback",
          message: "No hay GEMINI_API_KEY configurada.",
        },
        { status: 200 }
      );
    }

    const body = (await request.json()) as EducationAssistantRequest;

    const lessonTitle = body.lessonTitle?.trim();
    const lessonContent = body.lessonContent?.trim();
    const question = body.question?.trim();
    const mode = body.mode ?? "question";

    if (!lessonTitle || !lessonContent || !question) {
      return NextResponse.json(
        { error: "Faltan datos para generar la respuesta." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: buildPrompt({
        lessonTitle,
        lessonContent,
        question,
        mode,
      }),
      config: {
        temperature: 0.35,
        maxOutputTokens: 10000,
        },
    });

    const answer =
      response.text ??
      "No pude generar una respuesta en este momento. Intenta reformular tu pregunta.";

    return NextResponse.json({
      answer,
      source: "gemini",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al consultar el asistente IA.";

    return NextResponse.json(
      {
        answer: null,
        source: "fallback",
        message,
      },
      { status: 200 }
    );
  }
}