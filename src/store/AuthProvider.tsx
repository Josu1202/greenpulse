"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  changeUserPassword,
  createUser,
  getUserById,
  resetUserPasswordByEmail,
  updateUser,
  updateUserProfileImage,
  validateUserLogin,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/db/repositories";
import type { User } from "@/types";
import {
  clearSessionUserId,
  getSessionUserId,
  saveSessionUserId,
} from "@/utils/session";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (input: CreateUserInput) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loadSession: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  updateCurrentUser: (input: UpdateUserInput) => Promise<User>;
  updateCurrentUserProfileImage: (profileImage: string) => Promise<User>;
  changeCurrentUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<User>;
  resetPasswordByEmail: (email: string, newPassword: string) => Promise<User>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = getSessionUserId();

      if (!userId) {
        setUser(null);
        return;
      }

      const storedUser = await getUserById(userId);

      if (!storedUser) {
        clearSessionUserId();
        setUser(null);
        return;
      }

      setUser(storedUser);
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo cargar la sesión."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: CreateUserInput): Promise<User> => {
    try {
      setError(null);

      const createdUser = await createUser(input);

      saveSessionUserId(createdUser.id);
      setUser(createdUser);

      return createdUser;
    } catch (error) {
      setError(getErrorMessage(error, "No se pudo registrar el usuario."));
      throw error;
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      try {
        setError(null);

        const validUser = await validateUserLogin(email, password);

        if (!validUser) {
          throw new Error("Correo o contraseña incorrectos.");
        }

        saveSessionUserId(validUser.id);
        setUser(validUser);

        return validUser;
      } catch (error) {
        setError(getErrorMessage(error, "No se pudo iniciar sesión."));
        throw error;
      }
    },
    []
  );

  const logout = useCallback((): void => {
    clearSessionUserId();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const userId = getSessionUserId();

    if (!userId) {
      setUser(null);
      return null;
    }

    const storedUser = await getUserById(userId);

    if (!storedUser) {
      clearSessionUserId();
      setUser(null);
      return null;
    }

    setUser(storedUser);
    return storedUser;
  }, []);

  const updateCurrentUser = useCallback(
    async (input: UpdateUserInput): Promise<User> => {
      if (!user) {
        throw new Error("No hay una sesión activa.");
      }

      try {
        setError(null);

        const updatedUser = await updateUser(user.id, input);
        setUser(updatedUser);

        return updatedUser;
      } catch (error) {
        setError(getErrorMessage(error, "No se pudo actualizar el usuario."));
        throw error;
      }
    },
    [user]
  );

  const updateCurrentUserProfileImage = useCallback(
    async (profileImage: string): Promise<User> => {
      if (!user) {
        throw new Error("No hay una sesión activa.");
      }

      try {
        setError(null);

        const updatedUser = await updateUserProfileImage(user.id, profileImage);
        setUser(updatedUser);

        return updatedUser;
      } catch (error) {
        setError(
          getErrorMessage(error, "No se pudo actualizar la foto de perfil.")
        );
        throw error;
      }
    },
    [user]
  );

  const changeCurrentUserPassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<User> => {
      if (!user) {
        throw new Error("No hay una sesión activa.");
      }

      try {
        setError(null);

        const updatedUser = await changeUserPassword(
          user.id,
          currentPassword,
          newPassword
        );

        setUser(updatedUser);

        return updatedUser;
      } catch (error) {
        setError(getErrorMessage(error, "No se pudo cambiar la contraseña."));
        throw error;
      }
    },
    [user]
  );

  const resetPasswordByEmail = useCallback(
    async (email: string, newPassword: string): Promise<User> => {
      try {
        setError(null);

        return await resetUserPasswordByEmail(email, newPassword);
      } catch (error) {
        setError(
          getErrorMessage(error, "No se pudo restablecer la contraseña.")
        );
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSession();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      register,
      login,
      logout,
      loadSession,
      refreshUser,
      updateCurrentUser,
      updateCurrentUserProfileImage,
      changeCurrentUserPassword,
      resetPasswordByEmail,
      clearError,
    }),
    [
      user,
      isLoading,
      error,
      register,
      login,
      logout,
      loadSession,
      refreshUser,
      updateCurrentUser,
      updateCurrentUserProfileImage,
      changeCurrentUserPassword,
      resetPasswordByEmail,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}