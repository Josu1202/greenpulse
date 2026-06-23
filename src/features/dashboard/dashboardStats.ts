import type { Category, Report, StatusLog } from "@/types";

export interface DashboardKpis {
  total: number;
  pendientes: number;
  enRevision: number;
  resueltos: number;
}

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

export interface TrendDatum {
  name: string;
  value: number;
}

// Indicadores numéricos principales (tarjetas KPI).
export function calcularKpis(reports: Report[]): DashboardKpis {
  return {
    total: reports.length,
    pendientes: reports.filter((r) => r.status === "pending").length,
    enRevision: reports.filter((r) => r.status === "in_review").length,
    resueltos: reports.filter((r) => r.status === "resolved").length,
  };
}

// Reportes agrupados por categoría (para gráfica de dona).
// Usa el color real definido en cada categoría (DEFAULT_CATEGORIES).
export function reportesPorCategoria(
  reports: Report[],
  categories: Category[]
): ChartDatum[] {
  return categories
    .map((category) => ({
      name: category.name,
      value: reports.filter((r) => r.categoryId === category.id).length,
      color: category.color,
    }))
    .filter((datum) => datum.value > 0);
}

// Reportes agrupados por estado (para gráfica de barras).
export function reportesPorEstado(reports: Report[]): ChartDatum[] {
  return [
    {
      name: "Pendiente",
      value: reports.filter((r) => r.status === "pending").length,
      color: "#f59e0b",
    },
    {
      name: "En revisión",
      value: reports.filter((r) => r.status === "in_review").length,
      color: "#0ea5e9",
    },
    {
      name: "Resuelto",
      value: reports.filter((r) => r.status === "resolved").length,
      color: "#22c55e",
    },
  ];
}

// Reportes agrupados por prioridad (para gráfica de barras).
export function reportesPorPrioridad(reports: Report[]): ChartDatum[] {
  return [
    {
      name: "Alta",
      value: reports.filter((r) => r.priority === "high").length,
      color: "#ef4444",
    },
    {
      name: "Media",
      value: reports.filter((r) => r.priority === "medium").length,
      color: "#f59e0b",
    },
    {
      name: "Baja",
      value: reports.filter((r) => r.priority === "low").length,
      color: "#94a3b8",
    },
  ];
}

// Últimos reportes creados, ordenados del más reciente al más antiguo.
export function actividadReciente(reports: Report[], limit = 5): Report[] {
  return [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

/* ------------------------------------------------------------------ */
/* Índice de impacto ambiental                                         */
/* Aprovecha el campo impactFactor de cada categoría, que hasta ahora  */
/* estaba definido pero sin usar.                                      */
/* ------------------------------------------------------------------ */

export interface ImpactStats {
  // Presión ambiental vigente: suma del impactFactor de los reportes
  // que todavía no están resueltos.
  indiceActivo: number;
  // Impacto ya atendido: suma del impactFactor de los reportes resueltos.
  impactoMitigado: number;
  // Impacto total registrado (activo + mitigado).
  impactoTotal: number;
  // Porcentaje del impacto acumulado que ya fue mitigado (0-100).
  porcentajeMitigado: number;
  // Desglose del impacto activo por categoría (para una mini-leyenda/barras).
  detalle: ChartDatum[];
}

function impactFactorDe(categories: Category[], categoryId: string): number {
  return categories.find((c) => c.id === categoryId)?.impactFactor ?? 0;
}

export function calcularImpacto(
  reports: Report[],
  categories: Category[]
): ImpactStats {
  let indiceActivo = 0;
  let impactoMitigado = 0;

  for (const report of reports) {
    const factor = impactFactorDe(categories, report.categoryId);

    if (report.status === "resolved") {
      impactoMitigado += factor;
    } else {
      indiceActivo += factor;
    }
  }

  const impactoTotal = indiceActivo + impactoMitigado;
  const porcentajeMitigado =
    impactoTotal === 0
      ? 0
      : Math.round((impactoMitigado / impactoTotal) * 100);

  const detalle = categories
    .map((category) => ({
      name: category.name,
      value:
        reports.filter(
          (r) => r.categoryId === category.id && r.status !== "resolved"
        ).length * category.impactFactor,
      color: category.color,
    }))
    .filter((datum) => datum.value > 0)
    .sort((a, b) => b.value - a.value);

  return {
    indiceActivo,
    impactoMitigado,
    impactoTotal,
    porcentajeMitigado,
    detalle,
  };
}

/* ------------------------------------------------------------------ */
/* Tasa y tiempo de resolución                                         */
/* Usa la tabla statusLogs para medir cuánto tardó cada reporte en     */
/* llegar a "resolved" desde su creación.                              */
/* ------------------------------------------------------------------ */

export interface ResolutionStats {
  total: number;
  resueltos: number;
  tasaResolucion: number; // porcentaje 0-100
  tiempoPromedioHoras: number | null;
  tiempoPromedioDias: number | null;
  muestraConTiempo: number; // cuántos reportes resueltos tienen tiempo medible
}

export function calcularResolucion(
  reports: Report[],
  statusLogs: StatusLog[]
): ResolutionStats {
  const total = reports.length;
  const resueltos = reports.filter((r) => r.status === "resolved").length;
  const tasaResolucion =
    total === 0 ? 0 : Math.round((resueltos / total) * 100);

  const reportById = new Map(reports.map((report) => [report.id, report]));

  // Para cada reporte, el primer momento en que pasó a "resolved".
  const primerResuelto = new Map<string, number>();

  for (const log of statusLogs) {
    if (log.newStatus !== "resolved") {
      continue;
    }

    const cambiadoEn = new Date(log.changedAt).getTime();

    if (!Number.isFinite(cambiadoEn)) {
      continue;
    }

    const actual = primerResuelto.get(log.reportId);

    if (actual === undefined || cambiadoEn < actual) {
      primerResuelto.set(log.reportId, cambiadoEn);
    }
  }

  const duraciones: number[] = [];

  for (const [reportId, resueltoEn] of primerResuelto) {
    const report = reportById.get(reportId);

    if (!report || report.status !== "resolved") {
      continue;
    }

    const creadoEn = new Date(report.createdAt).getTime();

    if (!Number.isFinite(creadoEn)) {
      continue;
    }

    const diferencia = resueltoEn - creadoEn;

    if (diferencia >= 0) {
      duraciones.push(diferencia);
    }
  }

  if (duraciones.length === 0) {
    return {
      total,
      resueltos,
      tasaResolucion,
      tiempoPromedioHoras: null,
      tiempoPromedioDias: null,
      muestraConTiempo: 0,
    };
  }

  const promedioMs =
    duraciones.reduce((suma, valor) => suma + valor, 0) / duraciones.length;
  const horas = promedioMs / (1000 * 60 * 60);
  const dias = horas / 24;

  return {
    total,
    resueltos,
    tasaResolucion,
    tiempoPromedioHoras: Math.round(horas * 10) / 10,
    tiempoPromedioDias: Math.round(dias * 10) / 10,
    muestraConTiempo: duraciones.length,
  };
}

/* ------------------------------------------------------------------ */
/* Tendencia temporal de reportes creados                              */
/* Agrupa por día (rangos cortos) o por semana (rangos largos).        */
/* ------------------------------------------------------------------ */

function inicioDelDia(fecha: Date): Date {
  const copia = new Date(fecha);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function etiquetaDia(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

// dias = número de días hacia atrás, o null para "todo el historial".
export function tendenciaTemporal(
  reports: Report[],
  dias: number | null
): TrendDatum[] {
  if (reports.length === 0) {
    return [];
  }

  const hoy = inicioDelDia(new Date());

  let inicio: Date;

  if (dias !== null) {
    inicio = new Date(hoy);
    inicio.setDate(inicio.getDate() - (dias - 1));
  } else {
    const fechaMasAntigua = reports.reduce((min, report) => {
      const t = new Date(report.createdAt).getTime();
      return Number.isFinite(t) && t < min ? t : min;
    }, Date.now());
    inicio = inicioDelDia(new Date(fechaMasAntigua));
  }

  const spanDias =
    Math.round((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Rangos cortos: una barra/punto por día. Rangos largos: por semana.
  const agruparPorSemana = spanDias > 45;
  const tamanoBucketDias = agruparPorSemana ? 7 : 1;
  const cantidadBuckets = Math.max(1, Math.ceil(spanDias / tamanoBucketDias));

  const buckets: TrendDatum[] = [];

  for (let i = 0; i < cantidadBuckets; i++) {
    const inicioBucket = new Date(inicio);
    inicioBucket.setDate(inicioBucket.getDate() + i * tamanoBucketDias);

    buckets.push({
      name: agruparPorSemana
        ? `Sem. ${etiquetaDia(inicioBucket)}`
        : etiquetaDia(inicioBucket),
      value: 0,
    });
  }

  for (const report of reports) {
    const creado = inicioDelDia(new Date(report.createdAt));

    if (Number.isNaN(creado.getTime()) || creado < inicio) {
      continue;
    }

    const diffDias = Math.floor(
      (creado.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    );
    const indice = Math.floor(diffDias / tamanoBucketDias);

    if (indice >= 0 && indice < buckets.length) {
      buckets[indice].value += 1;
    }
  }

  return buckets;
}
