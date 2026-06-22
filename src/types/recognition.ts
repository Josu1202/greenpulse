export type WasteType =
  | "plastic"
  | "paper"
  | "cardboard"
  | "glass"
  | "metal"
  | "organic"
  | "electronic"
  | "textile"
  | "hazardous"
  | "mixed"
  | "not_identified";

export type RecognitionConfidence = "low" | "medium" | "high";

export interface WasteRecognitionResult {
  wasteType: WasteType;
  wasteTypeLabel: string;
  objectName: string;
  confidence: RecognitionConfidence;
  explanation: string;
  recommendation: string;
  binSuggestion: string;
  environmentalTip: string;
  source: "gemini" | "fallback";
}