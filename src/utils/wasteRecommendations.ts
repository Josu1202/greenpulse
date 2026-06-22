import type { WasteType } from "@/types";

interface WasteRecommendation {
  wasteType: WasteType;
  wasteTypeLabel: string;
  recommendation: string;
  binSuggestion: string;
  environmentalTip: string;
}

export const WASTE_RECOMMENDATIONS: Record<WasteType, WasteRecommendation> = {
  plastic: {
    wasteType: "plastic",
    wasteTypeLabel: "Plástico",
    recommendation:
      "Limpia y seca el plástico antes de reciclarlo. Si está contaminado con comida, aceite o químicos, debe manejarse como residuo común según las normas locales.",
    binSuggestion: "Contenedor de reciclaje para plástico.",
    environmentalTip:
      "Reducir botellas, bolsas y empaques plásticos ayuda a disminuir la contaminación en ríos, calles y zonas verdes.",
  },
  paper: {
    wasteType: "paper",
    wasteTypeLabel: "Papel",
    recommendation:
      "Si el papel está limpio y seco, puede reciclarse. Evita reciclar papel con grasa, comida o humedad.",
    binSuggestion: "Contenedor de papel reciclable.",
    environmentalTip:
      "Reutilizar hojas y reciclar papel ayuda a reducir la tala de árboles y el consumo de agua en procesos industriales.",
  },
  cardboard: {
    wasteType: "cardboard",
    wasteTypeLabel: "Cartón",
    recommendation:
      "Dobla o aplana el cartón para reducir espacio. Debe estar seco y sin restos de comida.",
    binSuggestion: "Contenedor de papel y cartón.",
    environmentalTip:
      "Separar cartón facilita su recuperación y disminuye el volumen de residuos enviados a disposición final.",
  },
  glass: {
    wasteType: "glass",
    wasteTypeLabel: "Vidrio",
    recommendation:
      "Separa botellas o frascos de vidrio limpios. Manipula con cuidado si está quebrado y evita mezclarlo con basura común.",
    binSuggestion: "Contenedor de vidrio, si está disponible.",
    environmentalTip:
      "El vidrio puede reciclarse muchas veces si se separa correctamente.",
  },
  metal: {
    wasteType: "metal",
    wasteTypeLabel: "Metal",
    recommendation:
      "Limpia latas o envases metálicos antes de reciclarlos. Evita mezclarlos con residuos orgánicos.",
    binSuggestion: "Contenedor de metales o reciclaje general.",
    environmentalTip:
      "Reciclar metales reduce la necesidad de extraer nuevos recursos naturales.",
  },
  organic: {
    wasteType: "organic",
    wasteTypeLabel: "Orgánico",
    recommendation:
      "Los restos orgánicos pueden aprovecharse para compostaje si no contienen químicos ni materiales no biodegradables.",
    binSuggestion: "Contenedor orgánico o compostera.",
    environmentalTip:
      "Separar residuos orgánicos reduce malos olores y puede generar abono para plantas.",
  },
  electronic: {
    wasteType: "electronic",
    wasteTypeLabel: "Electrónico",
    recommendation:
      "No lo tires con basura común. Llévalo a un punto de recolección de residuos electrónicos si está disponible.",
    binSuggestion: "Punto especial para residuos electrónicos.",
    environmentalTip:
      "Los residuos electrónicos pueden contener componentes que requieren manejo especial.",
  },
  textile: {
    wasteType: "textile",
    wasteTypeLabel: "Textil",
    recommendation:
      "Si la prenda aún sirve, puede donarse o reutilizarse. Si está deteriorada, revisa opciones de reciclaje textil.",
    binSuggestion: "Donación, reutilización o contenedor textil.",
    environmentalTip:
      "Extender la vida útil de la ropa reduce residuos y consumo de recursos.",
  },
  hazardous: {
    wasteType: "hazardous",
    wasteTypeLabel: "Residuo delicado",
    recommendation:
      "No lo mezcles con residuos comunes. Debe manejarse con cuidado y entregarse en puntos autorizados si existen.",
    binSuggestion: "Punto especial de residuos peligrosos o delicados.",
    environmentalTip:
      "Algunos residuos pueden afectar la salud o el ambiente si se desechan incorrectamente.",
  },
  mixed: {
    wasteType: "mixed",
    wasteTypeLabel: "Residuo mixto",
    recommendation:
      "Separa las partes reciclables si es posible. Si está muy contaminado o compuesto por varios materiales inseparables, puede ir a residuo común.",
    binSuggestion: "Separar componentes o residuo común.",
    environmentalTip:
      "Separar materiales antes de desecharlos mejora las posibilidades de reciclaje.",
  },
  not_identified: {
    wasteType: "not_identified",
    wasteTypeLabel: "No identificado",
    recommendation:
      "No se pudo identificar claramente el residuo. Intenta tomar otra foto con mejor iluminación y el objeto centrado.",
    binSuggestion: "Revisar manualmente antes de desechar.",
    environmentalTip:
      "Una imagen clara ayuda a clasificar mejor el residuo y evitar errores de disposición.",
  },
};

export function getWasteRecommendation(wasteType: WasteType) {
  return WASTE_RECOMMENDATIONS[wasteType] ?? WASTE_RECOMMENDATIONS.not_identified;
}