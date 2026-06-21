import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Resumen general de la actividad ambiental"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de reportes</CardTitle>
            <CardDescription>Pendiente de conexión a IndexedDB.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes pendientes</CardTitle>
            <CardDescription>Pendiente de conexión a datos reales.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes resueltos</CardTitle>
            <CardDescription>Pendiente de conexión a datos reales.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}