"use client";

import { useParams, useRouter } from "next/navigation";

import { AdminLessonEditor, AdminTabs } from "@/components/admin";
import { AdminRoute, DashboardLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import { useAdminLessons } from "@/hooks";
import type { AdminLessonEditorInput } from "@/components/admin";

function AdminLessonEditContent() {
  const router = useRouter();
  const params = useParams();
  const rawLessonId = params.lessonId;
  const lessonId = Array.isArray(rawLessonId) ? rawLessonId[0] : rawLessonId;

  const {
    lessons,
    completedByLesson,
    isLoading,
    updateLesson,
  } = useAdminLessons();

  const lesson = lessons.find((item) => item.id === lessonId);

  const handleSave = async (input: AdminLessonEditorInput) => {
    if (!lesson) {
      return;
    }

    await updateLesson(lesson.id, input);
    router.push("/admin/lessons");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AdminTabs active="lessons" />

        {isLoading ? (
          <Card>
            <p className="py-8 text-center text-sm text-slate-500">
              Cargando lectura...
            </p>
          </Card>
        ) : lesson ? (
          <AdminLessonEditor
            key={lesson.id}
            mode="edit"
            lesson={lesson}
            completions={completedByLesson[lesson.id] ?? 0}
            onSave={handleSave}
            onCancel={() => router.push("/admin/lessons")}
          />
        ) : (
          <Card>
            <p className="text-sm text-slate-600">
              No se encontró la lectura seleccionada.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminLessonEditPage() {
  return (
    <AdminRoute>
      <AdminLessonEditContent />
    </AdminRoute>
  );
}
