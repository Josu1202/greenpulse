const SESSION_USER_ID_KEY = "greenpulse_user_id";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSessionUserId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(SESSION_USER_ID_KEY);
}

export function saveSessionUserId(userId: string): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_USER_ID_KEY, userId);
}

export function clearSessionUserId(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_USER_ID_KEY);
}

export { SESSION_USER_ID_KEY };