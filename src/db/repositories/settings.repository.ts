import { db } from "@/db/database";
import type { AppSettings, MapCenter } from "@/types";

const SETTINGS_ID = "app";

export async function getAppSettings(): Promise<AppSettings | undefined> {
  return db.settings.get(SETTINGS_ID);
}

export async function saveAppSettings(settings: AppSettings): Promise<string> {
  await db.settings.put(settings);
  return settings.id;
}

export async function updateTheme(theme: AppSettings["theme"]): Promise<void> {
  const settings = await getAppSettings();

  if (!settings) {
    throw new Error("No existe configuración inicial de la aplicación.");
  }

  await db.settings.update(SETTINGS_ID, {
    theme,
  });
}

export async function updateDefaultMapCenter(
  defaultMapCenter: MapCenter
): Promise<void> {
  const settings = await getAppSettings();

  if (!settings) {
    throw new Error("No existe configuración inicial de la aplicación.");
  }

  await db.settings.update(SETTINGS_ID, {
    defaultMapCenter,
  });
}

export async function markSeedAsLoaded(): Promise<void> {
  const settings = await getAppSettings();

  if (!settings) {
    throw new Error("No existe configuración inicial de la aplicación.");
  }

  await db.settings.update(SETTINGS_ID, {
    seedLoaded: true,
  });
}

export async function resetAppSettings(): Promise<void> {
  await db.settings.delete(SETTINGS_ID);
}