import { MainLayout } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function RegisterPage() {
  return (
    <MainLayout>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>
            Próximamente se creará el formulario de registro local.
          </CardDescription>
        </CardHeader>
      </Card>
    </MainLayout>
  );
}