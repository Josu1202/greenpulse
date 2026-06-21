import { db } from "@/db/database";
import type { Category } from "@/types";
import { DEFAULT_CATEGORIES } from "@/utils/constants";

export async function getAllCategories(): Promise<Category[]> {
  return db.categories.toArray();
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return db.categories.get(id);
}

export async function seedCategoriesIfEmpty(): Promise<void> {
  const count = await db.categories.count();

  if (count === 0) {
    await db.categories.bulkPut(DEFAULT_CATEGORIES);
  }
}

export async function saveCategory(category: Category): Promise<string> {
  await db.categories.put(category);
  return category.id;
}

export async function deleteCategory(id: string): Promise<void> {
  await db.categories.delete(id);
}