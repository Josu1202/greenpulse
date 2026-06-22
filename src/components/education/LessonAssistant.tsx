"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Lightbulb,
  ListChecks,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { Button, Card } from "@/components/ui";
import { cn } from "@/utils";

interface LessonAssistantProps {
  lessonTitle: string;
  lessonContent: string;
  disabled?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  source?: "gemini" | "local";
}

type QuickAction =
  | "summary"
  | "keyIdeas"
  | "concepts"
  | "example"
  | "quizPrep";

const ignoredWords = [
  "sobre",
  "para",
  "como",
  "qué",
  "que",
  "cuál",
  "cual",
  "por",
  "del",
  "los",
  "las",
  "una",
  "uno",
  "con",
  "esta",
  "este",
  "lección",
  "texto",
  "explica",
  "explicame",
];

const conceptExplanations: Record<string, string> = {
  contaminacion:
    "La contaminación es la alteración negativa del ambiente por residuos, sustancias o actividades humanas.",
  residuos:
    "Los residuos son materiales que se desechan después de su uso. Si no se gestionan bien, pueden afectar el suelo, el agua y la salud.",
  reciclaje:
    "El reciclaje permite aprovechar ciertos residuos para convertirlos en nuevos materiales o productos.",
  agua: "El agua es un recurso esencial. Cuidarla implica evitar desperdicio, fugas y contaminación.",
  aire: "La calidad del aire puede verse afectada por humo, polvo, gases o quemas.",
  ruido:
    "La contaminación sonora ocurre cuando el ruido excesivo afecta la concentración, convivencia o bienestar.",
  comunidad:
    "La participación comunitaria ayuda a identificar problemas ambientales y buscar soluciones colectivas.",
  ambiente:
    "El ambiente incluye los elementos naturales y sociales que rodean a una comunidad.",
};

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^\w\s]/g, " ");
}

function getSentences(content: string) {
  return content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function getKeywords(question: string) {
  return normalizeText(question)
    .split(/\s+/)
    .filter((word) => word.length > 3 && !ignoredWords.includes(word));
}

function buildLocalAnswer(question: string, content: string) {
  const keywords = getKeywords(question);
  const sentences = getSentences(content);

  const matches = sentences.filter((sentence) => {
    const normalizedSentence = normalizeText(sentence);

    return keywords.some((keyword) => normalizedSentence.includes(keyword));
  });

  if (matches.length === 0) {
    return "No encontré una respuesta exacta en la lectura. Te recomiendo revisar nuevamente el texto y buscar las ideas principales relacionadas con tu pregunta.";
  }

  return `Según la lectura: ${matches.slice(0, 2).join(" ")}`;
}

function buildLocalQuickActionAnswer(action: QuickAction, content: string) {
  const sentences = getSentences(content);
  const normalizedContent = normalizeText(content);

  if (action === "summary") {
    return `Resumen de la lectura: ${sentences.slice(0, 3).join(" ")}`;
  }

  if (action === "keyIdeas") {
    const ideas = sentences.slice(0, 5);

    return `Ideas clave:\n${ideas
      .map((idea, index) => `${index + 1}. ${idea}`)
      .join("\n")}`;
  }

  if (action === "concepts") {
    const detectedConcepts = Object.entries(conceptExplanations).filter(
      ([concept]) => normalizedContent.includes(concept)
    );

    if (detectedConcepts.length === 0) {
      return "No detecté conceptos específicos suficientes, pero te recomiendo enfocarte en las causas, consecuencias y acciones ambientales mencionadas en la lectura.";
    }

    return `Conceptos importantes:\n${detectedConcepts
      .slice(0, 4)
      .map(([, explanation], index) => `${index + 1}. ${explanation}`)
      .join("\n")}`;
  }

  if (action === "example") {
    return "Ejemplo aplicado: si una comunidad observa basura acumulada, humo, ruido excesivo o una fuga de agua, puede registrar el problema, describirlo claramente y darle seguimiento para evitar que afecte más al entorno.";
  }

  return "Para prepararte para las preguntas, revisa: 1) cuál es el problema ambiental principal, 2) qué lo causa, 3) qué consecuencias tiene y 4) qué acciones pueden ayudar a reducirlo.";
}

async function askAiAssistant(params: {
  lessonTitle: string;
  lessonContent: string;
  question: string;
  mode: QuickAction | "question";
}) {
  const response = await fetch("/api/education-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("No se pudo consultar el asistente IA.");
  }

  const data = (await response.json()) as {
    answer: string | null;
    source?: "gemini" | "fallback";
    message?: string;
  };

  if (!data.answer) {
    throw new Error(data.message ?? "El asistente IA no devolvió respuesta.");
  }

  return data.answer;
}

const quickActions: {
  label: string;
  action: QuickAction;
  icon: typeof Sparkles;
}[] = [
  {
    label: "Resumir lectura",
    action: "summary",
    icon: Sparkles,
  },
  {
    label: "Ideas clave",
    action: "keyIdeas",
    icon: Lightbulb,
  },
  {
    label: "Explicar conceptos",
    action: "concepts",
    icon: Bot,
  },
  {
    label: "Darme un ejemplo",
    action: "example",
    icon: MessageCircle,
  },
  {
    label: "Prepararme para preguntas",
    action: "quizPrep",
    icon: ListChecks,
  },
];

export function LessonAssistant({
  lessonTitle,
  lessonContent,
  disabled = false,
}: LessonAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Hola, puedo ayudarte a entender la lección "${lessonTitle}". Intentaré usar IA y, si no está disponible, usaré el asistente local.`,
      source: "local",
    },
  ]);

  const canSend = useMemo(
    () => inputValue.trim().length > 0 && !isThinking,
    [inputValue, isThinking]
  );

  const addConversationTurn = (
    userText: string,
    assistantText: string,
    source: "gemini" | "local"
  ) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        text: userText,
      },
      {
        role: "assistant",
        text: assistantText,
        source,
      },
    ]);
  };

  const handleAsk = async (
    userText: string,
    mode: QuickAction | "question"
  ) => {
    if (!userText.trim()) {
      return;
    }

    try {
      setIsThinking(true);

      const answer = await askAiAssistant({
        lessonTitle,
        lessonContent,
        question: userText,
        mode,
      });

      setUsingFallback(false);
      addConversationTurn(userText, answer, "gemini");
    } catch {
      const localAnswer =
        mode === "question"
          ? buildLocalAnswer(userText, lessonContent)
          : buildLocalQuickActionAnswer(mode, lessonContent);

      setUsingFallback(true);
      addConversationTurn(userText, localAnswer, "local");
    } finally {
      setIsThinking(false);
      setInputValue("");
    }
  };

  const handleSend = () => {
    void handleAsk(inputValue.trim(), "question");
  };

  const handleQuickAction = (action: QuickAction, label: string) => {
    void handleAsk(label, action);
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="flex h-[34rem] w-[22rem] flex-col overflow-hidden p-0 shadow-xl sm:w-[26rem]">
          <div className="flex items-center justify-between border-b border-green-700 bg-green-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">Asistente educativo IA</p>
                <p className="text-xs text-green-100">
                  {usingFallback
                    ? "Modo local activo"
                    : "Con Gemini + respaldo local"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 transition hover:bg-green-700"
              aria-label="Cerrar asistente"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-slate-200 bg-white p-3">
            <p className="mb-2 text-xs font-medium text-slate-500">
              Acciones rápidas
            </p>

            <div className="flex flex-wrap gap-2">
              {quickActions.map((quickAction) => {
                const Icon = quickAction.icon;

                return (
                  <button
                    key={quickAction.action}
                    type="button"
                    onClick={() =>
                      handleQuickAction(quickAction.action, quickAction.label)
                    }
                    disabled={isThinking}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {quickAction.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[88%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto bg-green-600 text-white"
                    : "mr-auto bg-white text-slate-700 shadow-sm"
                )}
              >
                <p>{message.text}</p>

                {message.role === "assistant" && message.source ? (
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400">
                    {message.source === "gemini"
                      ? "Respuesta IA"
                      : "Respuesta local"}
                  </p>
                ) : null}
              </div>
            ))}

            {isThinking ? (
              <div className="mr-auto flex max-w-[88%] items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Pensando...
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Pregunta sobre la lectura..."
                className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <Button onClick={handleSend} disabled={!canSend}>
                {isThinking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Se desactiva al iniciar la evaluación para evitar apoyo durante
              las respuestas.
            </p>
          </div>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:bg-green-700"
          aria-label="Abrir asistente educativo"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}