import { MainLayout, ProtectedRoute } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function CreateEducationLessonPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Crear lectura educativa</CardTitle>
            <CardDescription>
              Próximamente aquí se podrá crear una lectura con título, texto,
              imágenes de referencia y preguntas de retroalimentación.
            </CardDescription>
          </CardHeader>
        </Card>
      </MainLayout>
    </ProtectedRoute>
  );
}