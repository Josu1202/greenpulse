import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, Star, UserRound } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { EducationLesson } from "@/types";

interface EducationLessonCardProps {
  lesson: EducationLesson;
  isCompleted?: boolean;
}

export function EducationLessonCard({
  lesson,
  isCompleted = false,
}: EducationLessonCardProps) {
  const lessonImage = lesson.image ?? lesson.referenceImages?.[0];

  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        {lessonImage ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.05), rgba(15, 23, 42, 0.35)), url(${lessonImage})`,
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400">
            <BookOpen className="h-14 w-14 text-white/90" />
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant={lesson.source === "base" ? "success" : "info"}>
            {lesson.source === "base" ? "Lección base" : "Creada por usuario"}
          </Badge>

          {lesson.isFeatured ? (
            <Badge variant="warning" className="gap-1 bg-white/90 text-amber-700 shadow-sm">
              <Star className="h-3.5 w-3.5" />
              Destacada
            </Badge>
          ) : null}
        </div>

        {isCompleted ? (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-green-700 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completada
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
          <CardDescription>{lesson.summary}</CardDescription>
        </CardHeader>

        <CardContent className="mt-auto">
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lesson.estimatedMinutes} min
            </span>

            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {lesson.questions.length} preguntas
            </span>

            {lesson.source === "user" && lesson.createdByUserName ? (
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-4 w-4" />
                {lesson.createdByUserName}
              </span>
            ) : null}
          </div>

          <Link
            href={`/education/${lesson.id}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition hover:bg-green-700"
          >
            {isCompleted ? "Repasar lección" : "Leer lección"}
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}