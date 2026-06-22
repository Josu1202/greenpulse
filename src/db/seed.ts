import { db } from "@/db/database";
import { DEFAULT_CATEGORIES, DEFAULT_MAP_CENTER } from "@/utils/constants";

export async function seedDatabase(): Promise<void> {
  const settings = await db.settings.get("app");
  const categoriesCount = await db.categories.count();

  if (settings?.seedLoaded && categoriesCount > 0) {
    return;
  }

  await db.transaction("rw", db.categories, db.settings, async () => {
    if (categoriesCount === 0) {
      await db.categories.bulkPut(DEFAULT_CATEGORIES);
    }

    await db.settings.put({
      id: "app",
      theme: settings?.theme ?? "light",
      defaultMapCenter: settings?.defaultMapCenter ?? DEFAULT_MAP_CENTER,
      seedLoaded: true,
    });
  });
}