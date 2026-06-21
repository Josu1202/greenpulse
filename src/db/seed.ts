import { db } from "@/db/database";
import { DEFAULT_CATEGORIES, DEFAULT_MAP_CENTER } from "@/utils/constants";

export async function seedDatabase() {
  const settings = await db.settings.get("app");

  if (settings?.seedLoaded) {
    return;
  }

  await db.categories.bulkPut(DEFAULT_CATEGORIES);

  await db.settings.put({
    id: "app",
    theme: "light",
    defaultMapCenter: DEFAULT_MAP_CENTER,
    seedLoaded: true,
  });
}