import type { ReportPriority, ReportStatus } from "@/types";

export interface RecognitionReportDraft {
  title: string;
  description: string;
  categoryId?: string;
  priority: ReportPriority;
  status: ReportStatus;
  image?: string;
  createdAt: string;
}

const RECOGNITION_REPORT_DRAFT_KEY = "greenpulse-recognition-report-draft";

export function saveRecognitionReportDraft(draft: RecognitionReportDraft) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(RECOGNITION_REPORT_DRAFT_KEY, JSON.stringify(draft));
}

export function getRecognitionReportDraft(): RecognitionReportDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawDraft = sessionStorage.getItem(RECOGNITION_REPORT_DRAFT_KEY);

  if (!rawDraft) {
    return null;
  }

  try {
    return JSON.parse(rawDraft) as RecognitionReportDraft;
  } catch {
    sessionStorage.removeItem(RECOGNITION_REPORT_DRAFT_KEY);
    return null;
  }
}

export function clearRecognitionReportDraft() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(RECOGNITION_REPORT_DRAFT_KEY);
}