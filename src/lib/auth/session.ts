import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "controlrent_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionData = {
  userId: string;
  restaurantId: string;
  role: "OWNER" | "STAFF";
  issuedAt: number;
};

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short");
  }
  return secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  const binary = atob(padded);
  const output = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    output[index] = binary.charCodeAt(index);
  }

  return output;
}

function base64UrlEncodeString(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

function base64UrlDecodeString(value: string): string {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function serializeSession(session: SessionData): Promise<string> {
  const payload = base64UrlEncodeString(JSON.stringify(session));
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

async function deserializeSession(raw: string): Promise<SessionData | null> {
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = await sign(payload);
  if (expected !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecodeString(payload)) as SessionData;
    if (!parsed.userId || !parsed.restaurantId || !parsed.role || !parsed.issuedAt) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function createSessionCookie(session: Omit<SessionData, "issuedAt">) {
  const payload: SessionData = {
    ...session,
    issuedAt: Date.now(),
  };

  return {
    name: SESSION_COOKIE_NAME,
    value: await serializeSession(payload),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  };
}

export async function readSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return deserializeSession(token);
}

export async function readSessionFromRequest(request: NextRequest): Promise<SessionData | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  return deserializeSession(token);
}

export function clearSession() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}
