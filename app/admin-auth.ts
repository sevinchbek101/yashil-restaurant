import { env } from "cloudflare:workers";

export const ADMIN_SESSION_COOKIE = "yashil_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

type AdminRuntimeEnv = {
  YASHIL_ADMIN_LOGIN?: string;
  YASHIL_ADMIN_PASSWORD?: string;
  YASHIL_ADMIN_SESSION_SECRET?: string;
};

const encoder = new TextEncoder();

function runtimeEnv(): AdminRuntimeEnv {
  return env as unknown as AdminRuntimeEnv;
}

function configValue(key: keyof AdminRuntimeEnv): string | undefined {
  const value = runtimeEnv()[key];
  if (value) return value;
  if (process.env.NODE_ENV === "development") {
    if (key === "YASHIL_ADMIN_LOGIN") return "admin";
    if (key === "YASHIL_ADMIN_PASSWORD") return "Admin123";
    if (key === "YASHIL_ADMIN_SESSION_SECRET") return "local-development-secret-change-me";
  }
  return undefined;
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function credentialsAreValid(login: string, password: string): Promise<boolean> {
  const expectedLogin = configValue("YASHIL_ADMIN_LOGIN");
  const expectedPassword = configValue("YASHIL_ADMIN_PASSWORD");
  if (!expectedLogin || !expectedPassword) return false;

  const [loginHash, expectedLoginHash, passwordHash, expectedPasswordHash] = await Promise.all([
    digest(login),
    digest(expectedLogin),
    digest(password),
    digest(expectedPassword),
  ]);
  return equalBytes(loginHash, expectedLoginHash) && equalBytes(passwordHash, expectedPasswordHash);
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sessionKey(): Promise<CryptoKey | null> {
  const secret = configValue("YASHIL_ADMIN_SESSION_SECRET");
  if (!secret) return null;
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createAdminSession(): Promise<string> {
  const key = await sessionKey();
  if (!key) throw new Error("Admin session secret is not configured");
  const expiresAt = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  const payload = base64Url(encoder.encode(`admin:${expiresAt}`));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
  return `${payload}.${base64Url(signature)}`;
}

export async function verifyAdminSession(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, encodedSignature, extra] = token.split(".");
  if (!payload || !encodedSignature || extra) return false;

  try {
    const key = await sessionKey();
    if (!key) return false;
    const validSignature = await crypto.subtle.verify("HMAC", key, fromBase64Url(encodedSignature), encoder.encode(payload));
    if (!validSignature) return false;
    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    const [role, expiresAt] = decoded.split(":");
    return role === "admin" && Number(expiresAt) > Date.now();
  } catch {
    return false;
  }
}

export function sessionFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === ADMIN_SESSION_COOKIE) return decodeURIComponent(value.join("="));
  }
  return undefined;
}
