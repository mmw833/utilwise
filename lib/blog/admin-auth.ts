import "server-only";

import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "uw_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const MIN_PASSWORD_LENGTH = 12;
const encoder = new TextEncoder();

type AdminSecrets = {
  ADMIN_PASSWORD?: string;
};

type SecretDiagnostics = {
  cloudflareContextAvailable: boolean;
  cloudflarePasswordPresent: boolean;
  processPasswordPresent: boolean;
  contextError?: string;
};

/**
 * Read the secret from the current Worker request context.
 * Async mode is supported by OpenNext and avoids relying on build-time env inlining.
 */
async function getSecrets(): Promise<AdminSecrets> {
  let workerPassword: string | undefined;

  try {
    const context = await getCloudflareContext({ async: true });
    workerPassword = (context.env as unknown as AdminSecrets).ADMIN_PASSWORD;
  } catch {
    // Local/alternate runtime fallback only. Never expose secret values.
  }

  const runtimeEnv = process.env as Record<string, string | undefined>;
  return {
    ADMIN_PASSWORD: workerPassword || runtimeEnv["ADMIN_PASSWORD"],
  };
}

async function getSecretDiagnostics(): Promise<SecretDiagnostics> {
  let cloudflareContextAvailable = false;
  let cloudflarePasswordPresent = false;
  let contextError: string | undefined;

  try {
    const context = await getCloudflareContext({ async: true });
    cloudflareContextAvailable = true;
    cloudflarePasswordPresent = Boolean(
      (context.env as unknown as AdminSecrets).ADMIN_PASSWORD,
    );
  } catch (error) {
    contextError = error instanceof Error ? error.name : "UnknownError";
  }

  const runtimeEnv = process.env as Record<string, string | undefined>;
  return {
    cloudflareContextAvailable,
    cloudflarePasswordPresent,
    processPasswordPresent: Boolean(runtimeEnv["ADMIN_PASSWORD"]),
    contextError,
  };
}

async function getAdminPassword(): Promise<string | undefined> {
  return (await getSecrets()).ADMIN_PASSWORD;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

/** The single admin password also keys session signatures; no second secret is needed. */
async function hmac(value: string): Promise<Uint8Array> {
  const password = await getAdminPassword();
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
  );
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export async function getAdminAuthStatus() {
  const password = await getAdminPassword();
  const diagnostics = await getSecretDiagnostics();
  return {
    passwordPresent: Boolean(password),
    passwordLengthValid: Boolean(password && password.length >= MIN_PASSWORD_LENGTH),
    diagnostics,
  };
}

export async function isAdminAuthConfigured(): Promise<boolean> {
  const password = await getAdminPassword();
  return Boolean(password && password.length >= MIN_PASSWORD_LENGTH);
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const password = await getAdminPassword();
  if (!password || password.length < MIN_PASSWORD_LENGTH || !candidate) return false;

  const [expected, supplied] = await Promise.all([
    hmac("admin-password:" + password),
    hmac("admin-password:" + candidate),
  ]);
  return constantTimeEqual(expected, supplied);
}

export async function createAdminSession(): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        role: "admin",
        exp: expiresAt,
        nonce: crypto.randomUUID(),
      }),
    ),
  );
  const signature = toBase64Url(await hmac("admin-session:" + payload));
  return `${payload}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  try {
    const [payload, signature] = parts;
    const decoded = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload)),
    );
    const expectedSignature = await hmac("admin-session:" + payload);

    if (!constantTimeEqual(expectedSignature, fromBase64Url(signature))) return false;
    return (
      decoded?.role === "admin" &&
      Number.isInteger(decoded?.exp) &&
      decoded.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(COOKIE_NAME)?.value);
}

export const adminSessionCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export function getAdminSessionCookieName(): string {
  return COOKIE_NAME;
}
