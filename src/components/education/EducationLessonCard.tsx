import Link from "next/link";
import { BookOpen, CheckCircle2, Clock, UserRound } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import type { EducationLesson } from "@/types";

interface EducationLessonCardProps {
  lesson: EducationLesson;
  isCompleted?: boolean;
}

export function EducationLessonCard({
  lesson,
  isCompleted = false,
}: EducationLessonCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge variant={lesson.source === "base" ? "success" : "info"}>
            {lesson.source === "base" ? "Lección base" : "Creada por usuario"}
          </Badge>

          {isCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completada
            </span>
          ) : null}
        </div>

        <CardTitle>{lesson.title}</CardTitle>
        <CardDescription>{lesson.summary}</CardDescription>
      </CardHeader>

      <CardContent>
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
    </Card>
  );
}