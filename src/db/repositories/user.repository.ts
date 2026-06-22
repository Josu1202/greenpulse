import { db } from "@/db/database";
import type { User, UserRole } from "@/types";
import { hashPassword, verifyPassword } from "@/utils/password";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  profileImage?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string;
}

type LegacyUser = User & {
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeName(name: string): string {
  return name.trim();
}

function normalizePassword(password: string): string {
  return password.trim();
}

function hasModernPassword(user: LegacyUser): boolean {
  return Boolean(user.passwordHash && user.passwordSalt);
}

async function removeLegacyPasswordField(userId: string): Promise<void> {
  await db.users
    .where("id")
    .equals(userId)
    .modify((storedUser) => {
      delete (storedUser as LegacyUser).password;
    });
}

async function getFreshUser(userId: string): Promise<User> {
  const user = await db.users.get(userId);

  if (!user) {
    throw new Error("El usuario no existe.");
  }

  return user;
}

async function validateStoredUserPassword(
  user: LegacyUser,
  password: string
): Promise<boolean> {
  const normalizedPassword = normalizePassword(password);

  if (hasModernPassword(user)) {
    return verifyPassword(
      normalizedPassword,
      user.passwordHash as string,
      user.passwordSalt as string
    );
  }

  if (user.password && user.password === normalizedPassword) {
    const { passwordHash, passwordSalt } = await hashPassword(
      normalizedPassword
    );

    await db.users.update(user.id, {
      passwordHash,
      passwordSalt,
      updatedAt: new Date().toISOString(),
    } as Partial<User>);

    await removeLegacyPasswordField(user.id);

    return true;
  }

  return false;
}

export async function getAllUsers(): Promise<User[]> {
  return db.users.orderBy("createdAt").reverse().toArray();
}

export async function getUserById(id: string): Promise<User | undefined> {
  return db.users.get(id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.users.where("email").equals(normalizeEmail(email)).first();
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const name = normalizeName(input.name);
  const email = normalizeEmail(input.email);
  const password = normalizePassword(input.password);

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!email) {
    throw new Error("El correo es obligatorio.");
  }

  if (!password) {
    throw new Error("La contraseña es obligatoria.");
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("Ya existe un usuario registrado con este correo.");
  }

  const { passwordHash, passwordSalt } = await hashPassword(password);
  const now = new Date().toISOString();

  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    passwordSalt,
    role: input.role ?? "student",
    profileImage: input.profileImage,
    createdAt: now,
    updatedAt: now,
  };

  await db.users.add(user);

  return user;
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<User> {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error("El usuario no existe.");
  }

  const changes: Partial<User> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    const name = normalizeName(input.name);

    if (!name) {
      throw new Error("El nombre no puede quedar vacío.");
    }

    changes.name = name;
  }

  if (input.email !== undefined) {
    const email = normalizeEmail(input.email);

    if (!email) {
      throw new Error("El correo no puede quedar vacío.");
    }

    const userWithSameEmail = await getUserByEmail(email);

    if (userWithSameEmail && userWithSameEmail.id !== id) {
      throw new Error("Ya existe otro usuario registrado con este correo.");
    }

    changes.email = email;
  }

  if (input.password !== undefined) {
    const password = normalizePassword(input.password);

    if (!password) {
      throw new Error("La contraseña no puede quedar vacía.");
    }

    const { passwordHash, passwordSalt } = await hashPassword(password);

    changes.passwordHash = passwordHash;
    changes.passwordSalt = passwordSalt;
  }

  if (input.role !== undefined) {
    changes.role = input.role;
  }

  if (input.profileImage !== undefined) {
    changes.profileImage = input.profileImage;
  }

  await db.users.update(id, changes);

  if (input.password !== undefined) {
    await removeLegacyPasswordField(id);
  }

  return getFreshUser(id);
}

export async function updateUserProfileImage(
  id: string,
  profileImage: string
): Promise<User> {
  return updateUser(id, {
    profileImage,
  });
}

export async function changeUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<User> {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error("El usuario no existe.");
  }

  const isCurrentPasswordValid = await validateStoredUserPassword(
    existingUser as LegacyUser,
    currentPassword
  );

  if (!isCurrentPasswordValid) {
    throw new Error("La contraseña actual es incorrecta.");
  }

  const normalizedNewPassword = normalizePassword(newPassword);

  if (!normalizedNewPassword) {
    throw new Error("La nueva contraseña no puede quedar vacía.");
  }

  const { passwordHash, passwordSalt } = await hashPassword(
    normalizedNewPassword
  );

  await db.users.update(id, {
    passwordHash,
    passwordSalt,
    updatedAt: new Date().toISOString(),
  } as Partial<User>);

  await removeLegacyPasswordField(id);

  return getFreshUser(id);
}

export async function resetUserPasswordByEmail(
  email: string,
  newPassword: string
): Promise<User> {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("No existe un usuario registrado con este correo.");
  }

  const password = normalizePassword(newPassword);

  if (!password) {
    throw new Error("La nueva contraseña no puede quedar vacía.");
  }

  const { passwordHash, passwordSalt } = await hashPassword(password);

  await db.users.update(user.id, {
    passwordHash,
    passwordSalt,
    updatedAt: new Date().toISOString(),
  } as Partial<User>);

  await removeLegacyPasswordField(user.id);

  return getFreshUser(user.id);
}

export async function validateUserLogin(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValidPassword = await validateStoredUserPassword(
    user as LegacyUser,
    password
  );

  if (!isValidPassword) {
    return null;
  }

  return getFreshUser(user.id);
}

export async function deleteUser(id: string): Promise<void> {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error("El usuario no existe.");
  }

  await db.transaction("rw", db.users, db.reports, db.statusLogs, async () => {
    const userReports = await db.reports.where("userId").equals(id).toArray();
    const reportIds = userReports.map((report) => report.id);

    if (reportIds.length > 0) {
      await db.statusLogs.where("reportId").anyOf(reportIds).delete();
      await db.reports.where("userId").equals(id).delete();
    }

    await db.users.delete(id);
  });
}

export async function clearUsers(): Promise<void> {
  await db.users.clear();
}