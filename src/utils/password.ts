const ITERATIONS = 100_000;
const KEY_LENGTH = 256;
const HASH_ALGORITHM = "SHA-256";
const SALT_LENGTH = 16;

export interface PasswordHashResult {
  passwordHash: string;
  passwordSalt: string;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return buffer;
}

function stringToArrayBuffer(value: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(value);
  const buffer = new ArrayBuffer(encoded.byteLength);
  const bytes = new Uint8Array(buffer);

  bytes.set(encoded);

  return buffer;
}

function createSalt(): string {
  const buffer = new ArrayBuffer(SALT_LENGTH);
  const salt = new Uint8Array(buffer);

  window.crypto.getRandomValues(salt);

  return bytesToBase64(salt);
}

async function derivePasswordHash(
  password: string,
  passwordSalt: string
): Promise<string> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    stringToArrayBuffer(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: base64ToArrayBuffer(passwordSalt),
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH
  );

  return bytesToBase64(new Uint8Array(derivedBits));
}

function safeCompareBase64(a: string, b: string): boolean {
  const bufferA = base64ToArrayBuffer(a);
  const bufferB = base64ToArrayBuffer(b);

  const bytesA = new Uint8Array(bufferA);
  const bytesB = new Uint8Array(bufferB);

  if (bytesA.length !== bytesB.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < bytesA.length; index += 1) {
    result |= bytesA[index] ^ bytesB[index];
  }

  return result === 0;
}

export async function hashPassword(
  password: string
): Promise<PasswordHashResult> {
  const cleanPassword = password.trim();

  if (!cleanPassword) {
    throw new Error("La contraseña es obligatoria.");
  }

  const passwordSalt = createSalt();
  const passwordHash = await derivePasswordHash(cleanPassword, passwordSalt);

  return {
    passwordHash,
    passwordSalt,
  };
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
  passwordSalt: string
): Promise<boolean> {
  const cleanPassword = password.trim();

  if (!cleanPassword) {
    return false;
  }

  const candidateHash = await derivePasswordHash(cleanPassword, passwordSalt);

  return safeCompareBase64(candidateHash, passwordHash);
}