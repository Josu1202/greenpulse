import { db } from "@/db/database";
import { DEFAULT_CATEGORIES, DEFAULT_MAP_CENTER } from "@/utils/constants";
import { hashPassword } from "@/utils/password";
import type { User } from "@/types";

const DEFAULT_ADMIN = {
  id: "greenpulse-default-admin",
  name: "Administrador GreenPulse",
  email: "admin@greenpulse.local",
  password: "Admin1234",
} as const;

async function ensureDefaultAdmin(): Promise<void> {
  const existingAdmin = await db.users
    .where("email")
    .equals(DEFAULT_ADMIN.email)
    .first();

  const now = new Date().toISOString();

  if (existingAdmin) {
    await db.users.update(existingAdmin.id, {
      name: existingAdmin.name || DEFAULT_ADMIN.name,
      role: "admin",
      isActive: true,
      updatedAt: now,
    } as Partial<User>);

    return;
  }

  const { passwordHash, passwordSalt } = await hashPassword(
    DEFAULT_ADMIN.password
  );

  await db.users.add({
    id: DEFAULT_ADMIN.id,
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    passwordHash,
    passwordSalt,
    role: "admin",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
}

async function normalizeExistingRecords(): Promise<void> {
  await db.users.toCollection().modify((user) => {
    if (user.isActive === undefined) {
      user.isActive = true;
    }
  });

  await db.educationLessons.toCollection().modify((lesson) => {
    if (!lesson.status) {
      lesson.status = lesson.source === "base" ? "published" : "published";
    }

    if (lesson.isFeatured === undefined) {
      lesson.isFeatured = false;
    }
  });
}

export async function seedDatabase(): Promise<void> {
  const settings = await db.settings.get("app");
  const categoriesCount = await db.categories.count();

  await db.transaction("rw", db.categories, db.settings, async () => {
    if (categoriesCount === 0) {
      await db.categories.bulkPut(DEFAULT_CATEGORIES);
    }

    if (!settings?.seedLoaded || categoriesCount === 0) {
      await db.settings.put({
        id: "app",
        theme: settings?.theme ?? "light",
        defaultMapCenter: settings?.defaultMapCenter ?? DEFAULT_MAP_CENTER,
        seedLoaded: true,
      });
    }
  });

  await normalizeExistingRecords();
  await ensureDefaultAdmin();
}

export { DEFAULT_ADMIN };
