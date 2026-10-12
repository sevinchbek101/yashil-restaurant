import { env } from "cloudflare:workers";

const CHECKOUT_API = "https://checkout.uz/api/v1";
const API_KEY_SETTING = "checkout_api_key_encrypted";
const encoder = new TextEncoder();

type RuntimeSecrets = {
  YASHIL_SETTINGS_ENCRYPTION_SECRET?: string;
  YASHIL_CHECKOUT_WEBHOOK_SECRET?: string;
};

type Database = typeof env.DB;

function secrets(): RuntimeSecrets {
  return env as unknown as RuntimeSecrets;
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

async function encryptionKey(): Promise<CryptoKey> {
  const secret = secrets().YASHIL_SETTINGS_ENCRYPTION_SECRET;
  if (!secret) throw new Error("Encryption secret is not configured");
  const raw = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encrypt(value: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await encryptionKey(), encoder.encode(value)));
  return `v1.${base64Url(iv)}.${base64Url(encrypted)}`;
}

async function decrypt(value: string): Promise<string> {
  const [version, encodedIv, encodedData] = value.split(".");
  if (version !== "v1" || !encodedIv || !encodedData) throw new Error("Unsupported encrypted value");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64Url(encodedIv) }, await encryptionKey(), fromBase64Url(encodedData));
  return new TextDecoder().decode(decrypted);
}

export async function getCheckoutApiKey(db: Database): Promise<string | null> {
  const row = await db.prepare("SELECT value FROM settings WHERE key=?").bind(API_KEY_SETTING).first<{ value: string }>();
  if (!row?.value) return null;
  try {
    return await decrypt(row.value);
  } catch {
    return null;
  }
}

export async function checkoutIsConfigured(db: Database): Promise<boolean> {
  const row = await db.prepare("SELECT 1 configured FROM settings WHERE key=?").bind(API_KEY_SETTING).first();
  return !!row;
}

export async function saveCheckoutApiKey(db: Database, apiKey: string): Promise<void> {
  const encrypted = await encrypt(apiKey.trim());
  await db.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(API_KEY_SETTING, encrypted).run();
}

export async function removeCheckoutApiKey(db: Database): Promise<void> {
  await db.prepare("DELETE FROM settings WHERE key=?").bind(API_KEY_SETTING).run();
}

export function checkoutWebhookSecret(): string | null {
  return secrets().YASHIL_CHECKOUT_WEBHOOK_SECRET || null;
}

export async function checkoutRequest<T>(apiKey: string, endpoint: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${CHECKOUT_API}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({ error: "CHECKOUT.UZ javobi o‘qilmadi" }));
  if (!response.ok) {
    const message = typeof data?.error === "string" ? data.error : `CHECKOUT.UZ xatosi (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export function safeCheckoutError(error: unknown): string {
  const message = error instanceof Error ? error.message : "CHECKOUT.UZ bilan ulanishda xatolik";
  return message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").slice(0, 240);
}
