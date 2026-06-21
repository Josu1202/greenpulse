import { MainLayout } from "@/components/layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function MapPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Mapa ambiental</h1>
          <p className="text-slate-600">
            Aquí se mostrarán los reportes geolocalizados.
          </p>
        </div>

        <Card className="min-h-96">
          <CardHeader>
            <CardTitle>Mapa</CardTitle>
            <CardDescription>
              Próximamente se integrará Leaflet con los reportes guardados.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
}