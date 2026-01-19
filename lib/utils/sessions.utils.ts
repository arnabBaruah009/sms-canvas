import Cookies from "js-cookie";

export const STORAGE_PROFILE_DATA = "sms-canvas-profileData";
export const SESSION_COOKIE_NAME = "sms-canvas-session";

export function createSession(token: string) {
  const expiresAt = 2; // expires in 2 days

  Cookies.set(SESSION_COOKIE_NAME, token, {
    secure: true,
    expires: expiresAt, // in days
    sameSite: "lax",
    path: "/",
  });
}

export function deleteSession() {
  Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
  localStorage.removeItem(STORAGE_PROFILE_DATA);
}

type DecodedToken = {
  id: string;
  team_id: string | null;
  type: string;
  email: string;
  iat: number;
  [key: string]: any; // To allow for additional properties if needed
};

export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    // Use atob in the browser or Buffer in Node.js
    const decodedPayload =
      typeof window !== "undefined"
        ? atob(payload)
        : Buffer.from(payload, "base64").toString("utf-8");

    return JSON.parse(decodedPayload) as DecodedToken;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const updateLocalStorage = (
  localStorageKey: string,
  objectKey: string,
  value: unknown
): void => {
  const storedData: { data: Record<string, unknown> } = JSON.parse(
    localStorage.getItem(localStorageKey) || "null"
  ) || { data: {} };

  if (!storedData.data) {
    storedData.data = {};
  }

  storedData.data[objectKey] = value;

  localStorage.setItem(localStorageKey, JSON.stringify(storedData));
};
