import { db } from "@/db/database";
import type { User, UserRole } from "@/types";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export async function getAllUsers(): Promise<User[]> {
  return db.users.toArray();
}

export async function getUserById(id: string): Promise<User | undefined> {
  return db.users.get(id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.users.where("email").equalsIgnoreCase(email).first();
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const existingUser = await getUserByEmail(input.email);

  if (existingUser) {
    throw new Error("Ya existe un usuario registrado con este correo.");
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email.toLowerCase().trim(),
    password: input.password,
    role: input.role ?? "student",
    createdAt: new Date().toISOString(),
  };

  await db.users.add(user);

  return user;
}

export async function validateUserLogin(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.users.delete(id);
}