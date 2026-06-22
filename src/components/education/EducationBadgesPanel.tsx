"use client";

import { Award, Lock, Medal, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useEducation } from "@/hooks";
import { EDUCATION_BADGES } from "@/utils";
import { cn } from "@/utils";

export function EducationBadgesPanel() {
  const {
    completedLessonsCount,
    earnedBadges,
    nextBadge,
    isLoading,
  } = useEducation();

  const earnedBadgeIds = earnedBadges.map((badge) => badge.id);

  const previousBadgeRequirement = earnedBadges.length
    ? earnedBadges[earnedBadges.length - 1].requiredLessons
    : 0;

  const nextRequirement = nextBadge?.requiredLessons ?? 50;

  const progressInCurrentLevel =
    completedLessonsCount - previousBadgeRequirement;

  const lessonsNeededForNextLevel = nextRequirement - previousBadgeRequirement;

  const progressPercentage = nextBadge
    ? Math.min(
        100,
        Math.round((progressInCurrentLevel / lessonsNeededForNextLevel) * 100)
      )
    : 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-green-600" />
          <CardTitle>Medallas educativas</CardTitle>
        </div>

        <CardDescription>
          Completa lecciones ambientales para desbloquear medallas en tu perfil.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">
            Cargando progreso educativo...
          </p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-green-50 p-4">
                <p className="text-3xl font-bold text-green-700">
                  {completedLessonsCount}
                </p>
                <p className="text-sm text-green-800">
                  Lecciones completadas
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-3xl font-bold text-slate-900">
                  {earnedBadges.length}
                </p>
                <p className="text-sm text-slate-600">Medallas ganadas</p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-lg font-semibold text-amber-800">
                  {nextBadge ? nextBadge.name : "Máximo nivel"}
                </p>
                <p className="text-sm text-amber-700">
                  {nextBadge
                    ? `Próxima medalla a las ${nextBadge.requiredLessons} lecciones`
                    : "Ya desbloqueaste todas las medallas"}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Progreso hacia la próxima medalla
                </span>
                <span className="text-slate-500">
                  {nextBadge
                    ? `${completedLessonsCount}/${nextBadge.requiredLessons}`
                    : "50/50"}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {EDUCATION_BADGES.map((badge) => {
                const isEarned = earnedBadgeIds.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "rounded-2xl border p-4 transition",
                      isEarned
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50 opacity-75"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl",
                          isEarned ? "bg-white" : "bg-white grayscale"
                        )}
                      >
                        {badge.emoji}
                      </div>

                      {isEarned ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-medium text-white">
                          <Sparkles className="h-3.5 w-3.5" />
                          Ganada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                          <Lock className="h-3.5 w-3.5" />
                          Bloqueada
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      <Medal
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isEarned ? "text-green-600" : "text-slate-400"
                        )}
                      />

                      <div>
                        <h3
                          className={cn(
                            "font-semibold",
                            isEarned ? "text-green-900" : "text-slate-700"
                          )}
                        >
                          {badge.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          {badge.description}
                        </p>

                        <p className="mt-2 text-xs font-medium text-slate-500">
                          Requiere {badge.requiredLessons} lecciones.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}