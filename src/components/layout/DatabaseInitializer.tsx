"use client";

import { useDatabaseSeed } from "@/hooks";

export function DatabaseInitializer() {
  useDatabaseSeed();

  return null;
}