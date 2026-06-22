import { MainLayout, ProtectedRoute } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function EducationLessonDetailPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Detalle de lección</CardTitle>
            <CardDescription>
              Próximamente aquí se mostrará la lectura, el asistente contextual
              y las preguntas de retroalimentación.
            </CardDescription>
          </CardHeader>
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
}