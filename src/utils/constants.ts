import type { Category, ReportPriority, ReportStatus } from "@/types";

export const APP_NAME = "GreenPulse";

export const DEFAULT_MAP_CENTER = {
  lat: 13.4833,
  lng: -88.1833,
};

export const REPORT_STATUSES: {
  value: ReportStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pendiente",
  },
  {
    value: "in_review",
    label: "En revisión",
  },
  {
    value: "resolved",
    label: "Resuelto",
  },
];

export const REPORT_PRIORITIES: {
  value: ReportPriority;
  label: string;
}[] = [
  {
    value: "low",
    label: "Baja",
  },
  {
    value: "medium",
    label: "Media",
  },
  {
    value: "high",
    label: "Alta",
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "waste",
    name: "Residuos",
    color: "#22c55e",
    description:
      "Acumulación de basura, desechos sólidos o residuos mal gestionados.",
    impactFactor: 3,
  },
  {
    id: "water",
    name: "Agua",
    color: "#0ea5e9",
    description:
      "Problemas relacionados con contaminación, fugas o mal uso del agua.",
    impactFactor: 4,
  },
  {
    id: "air",
    name: "Aire",
    color: "#94a3b8",
    description: "Contaminación del aire, humo, malos olores o emisiones.",
    impactFactor: 4,
  },
  {
    id: "vegetation",
    name: "Vegetación",
    color: "#16a34a",
    description: "Daño a zonas verdes, árboles, jardines o áreas naturales.",
    impactFactor: 2,
  },
  {
    id: "noise",
    name: "Ruido",
    color: "#f97316",
    description: "Contaminación sonora o molestias por ruido excesivo.",
    impactFactor: 2,
  },
];