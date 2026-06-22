"use client";

import { useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

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
}

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
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^\w\s]/g, " ");
}

function buildAssistantAnswer(question: string, content: string) {
  const normalizedQuestion = normalizeText(question);

  const keywords = normalizedQuestion
    .split(/\s+/)
    .filter((word) => word.length > 3 && !ignoredWords.includes(word));

  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const matches = sentences.filter((sentence) => {
    const normalizedSentence = normalizeText(sentence);

    return keywords.some((keyword) => normalizedSentence.includes(keyword));
  });

  if (matches.length === 0) {
    return "No encontré una respuesta exacta en la lectura. Te recomiendo revisar nuevamente el texto y buscar las ideas principales relacionadas con tu pregunta.";
  }

  return `Según la lectura: ${matches.slice(0, 2).join(" ")}`;
}

export function LessonAssistant({
  lessonTitle,
  lessonContent,
  disabled = false,
}: LessonAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Hola, puedo ayudarte a entender la lección "${lessonTitle}". Pregúntame algo sobre el texto.`,
    },
  ]);

  const canSend = useMemo(() => inputValue.trim().length > 0, [inputValue]);

  const handleSend = () => {
    const question = inputValue.trim();

    if (!question) {
      return;
    }

    const answer = buildAssistantAnswer(question, lessonContent);

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        text: question,
      },
      {
        role: "assistant",
        text: answer,
      },
    ]);

    setInputValue("");
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="flex h-[28rem] w-[22rem] flex-col overflow-hidden p-0 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-green-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Asistente educativo</p>
                <p className="text-xs text-green-100">
                  Responde con base en la lectura
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

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                  message.role === "user"
                    ? "ml-auto bg-green-600 text-white"
                    : "mr-auto bg-white text-slate-700 shadow-sm"
                )}
              >
                {message.text}
              </div>
            ))}
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
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              El asistente se desactiva durante la evaluación.
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