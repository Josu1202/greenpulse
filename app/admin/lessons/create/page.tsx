"use client";

import { useRouter } from "next/navigation";

import { AdminLessonEditor, AdminTabs } from "@/components/admin";
import { AdminRoute, DashboardLayout } from "@/components/layout";
import { useAdminLessons } from "@/hooks";
import type { AdminLessonEditorInput } from "@/components/admin";

function AdminLessonCreateContent() {
  const router = useRouter();
  const { createLesson } = useAdminLessons();

  const handleSave = async (input: AdminLessonEditorInput) => {
    await createLesson(input);
    router.push("/admin/lessons");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AdminTabs active="lessons" />

        <AdminLessonEditor
          mode="create"
          onSave={handleSave}
          onCancel={() => router.push("/admin/lessons")}
        />
      </div>
    </DashboardLayout>
  );
}

export default function AdminLessonCreatePage() {
  return (
    <AdminRoute>
      <AdminLessonCreateContent />
    </AdminRoute>
  );
}
