"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createUser,
  getUserById,
  validateUserLogin,
  type CreateUserInput,
} from "@/db/repositories";
import type { User } from "@/types";

const SESSION_USER_ID_KEY = "greenpulse_user_id";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = localStorage.getItem(SESSION_USER_ID_KEY);

      if (!userId) {
        setUser(null);
        return;
      }

      const storedUser = await getUserById(userId);

      if (!storedUser) {
        localStorage.removeItem(SESSION_USER_ID_KEY);
        setUser(null);
        return;
      }

      setUser(storedUser);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar la sesión.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = async (input: CreateUserInput) => {
    try {
      setError(null);

      const createdUser = await createUser(input);

      localStorage.setItem(SESSION_USER_ID_KEY, createdUser.id);
      setUser(createdUser);

      return createdUser;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo registrar el usuario.";

      setError(message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      const validUser = await validateUserLogin(email, password);

      if (!validUser) {
        throw new Error("Correo o contraseña incorrectos.");
      }

      localStorage.setItem(SESSION_USER_ID_KEY, validUser.id);
      setUser(validUser);

      return validUser;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión.";

      setError(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_USER_ID_KEY);
    setUser(null);
  };

useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadSession();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [loadSession]);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    register,
    login,
    logout,
    loadSession,
  };
}