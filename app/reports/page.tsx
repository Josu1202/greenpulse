import { MainLayout } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Reportes ambientales
          </h1>
          <p className="text-slate-600">
            Aquí se listarán, crearán y filtrarán los reportes ambientales.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de reportes</CardTitle>
            <CardDescription>
              Próximamente se conectará con el CRUD de reportes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
}