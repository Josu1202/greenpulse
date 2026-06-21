import { MainLayout } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function LoginPage() {
  return (
    <MainLayout>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Próximamente se conectará con la autenticación local usando
            IndexedDB.
          </CardDescription>
        </CardHeader>
      </Card>
    </MainLayout>
  );
}