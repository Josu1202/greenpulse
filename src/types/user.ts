export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}