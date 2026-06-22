"use client";

import { useAuthContext } from "@/store";

export function useAuth() {
  return useAuthContext();
}
