export type EducationLessonSource = "base" | "user";

export interface EducationQuestionOption {
  id: string;
  text: string;
}

export interface EducationQuestion {
  id: string;
  question: string;
  options: EducationQuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface EducationLesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes: number;
  source: EducationLessonSource;
  createdByUserId?: string;
  createdByUserName?: string;
  questions: EducationQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface EducationLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}