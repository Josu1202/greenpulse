"use client";

import { useCallback, useEffect, useState } from "react";

import {
  deleteCategory,
  getAllCategories,
  saveCategory,
  seedCategoriesIfEmpty,
} from "@/db/repositories";
import type { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await seedCategoriesIfEmpty();

      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las categorías.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrUpdateCategory = async (category: Category) => {
    try {
      setError(null);
      await saveCategory(category);
      await loadCategories();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la categoría.";

      setError(message);
      throw error;
    }
  };

  const removeCategory = async (id: string) => {
    try {
      setError(null);
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría.";

      setError(message);
      throw error;
    }
  };

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadCategories();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    loadCategories,
    createOrUpdateCategory,
    removeCategory,
  };
}