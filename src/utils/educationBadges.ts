export interface EducationBadge {
  id: string;
  name: string;
  description: string;
  requiredLessons: number;
  emoji: string;
}

export const EDUCATION_BADGES: EducationBadge[] = [
  {
    id: "green-sprout",
    name: "Brote Verde",
    description: "Completó 5 lecciones educativas.",
    requiredLessons: 5,
    emoji: "🌱",
  },
  {
    id: "eco-guardian",
    name: "Guardián Ambiental",
    description: "Completó 10 lecciones educativas.",
    requiredLessons: 10,
    emoji: "🛡️",
  },
  {
    id: "water-protector",
    name: "Protector del Agua",
    description: "Completó 15 lecciones educativas.",
    requiredLessons: 15,
    emoji: "💧",
  },
  {
    id: "air-defender",
    name: "Defensor del Aire",
    description: "Completó 20 lecciones educativas.",
    requiredLessons: 20,
    emoji: "🌬️",
  },
  {
    id: "recycling-hero",
    name: "Héroe del Reciclaje",
    description: "Completó 25 lecciones educativas.",
    requiredLessons: 25,
    emoji: "♻️",
  },
  {
    id: "green-restorer",
    name: "Restaurador Verde",
    description: "Completó 30 lecciones educativas.",
    requiredLessons: 30,
    emoji: "🌳",
  },
  {
    id: "eco-watch",
    name: "Vigía Ecológico",
    description: "Completó 35 lecciones educativas.",
    requiredLessons: 35,
    emoji: "🔎",
  },
  {
    id: "sustainable-leader",
    name: "Líder Sostenible",
    description: "Completó 40 lecciones educativas.",
    requiredLessons: 40,
    emoji: "🏅",
  },
  {
    id: "environmental-ambassador",
    name: "Embajador Ambiental",
    description: "Completó 45 lecciones educativas.",
    requiredLessons: 45,
    emoji: "🌎",
  },
  {
    id: "greenpulse-master",
    name: "Maestro GreenPulse",
    description: "Completó 50 lecciones educativas.",
    requiredLessons: 50,
    emoji: "🏆",
  },
];

export function getEarnedEducationBadges(
  completedLessonsCount: number
): EducationBadge[] {
  return EDUCATION_BADGES.filter(
    (badge) => completedLessonsCount >= badge.requiredLessons
  );
}

export function getNextEducationBadge(
  completedLessonsCount: number
): EducationBadge | undefined {
  return EDUCATION_BADGES.find(
    (badge) => completedLessonsCount < badge.requiredLessons
  );
}