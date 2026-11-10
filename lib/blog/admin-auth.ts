import "server-only";

import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "uw_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

type AdminSecrets = {
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
};

function getSecrets(): AdminSecrets {
  let workerEnv: AdminSecrets = {};
  try {
    const context = getCloudflareContext();
    workerEnv = context.env as unknown as AdminSecrets;
  } catch {
    // Local Next.js development can use uncommitted .env.local values.
  }

  return {
    ADMIN_PASSWORD: workerEnv.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET:
      workerEnv.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET,
  };
}

function requireSessionSecret(): string {
  const secret = getSecrets().ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  return secret;
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

async function hmac(value: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(requireSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

export function isAdminAuthConfigured(): boolean {
  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = getSecrets();
  return Boolean(
    ADMIN_PASSWORD &&
      ADMIN_PASSWORD.length >= 12 &&
      ADMIN_SESSION_SECRET &&
      ADMIN_SESSION_SECRET.length >= 32,
  );
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const { ADMIN_PASSWORD } = getSecrets();
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || !candidate) return false;

  const [expected, supplied] = await Promise.all([
    hmac(`admin-password:${ADMIN_PASSWORD}`),
    hmac(`admin-password:${candidate}`),
  ]);
  return constantTimeEqual(expected, supplied);
}

export async function createAdminSession(): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ role: "admin", exp: expiresAt, nonce: crypto.randomUUID() })),
  );
  const signature = toBase64Url(await hmac(payload));
  return `${payload}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  try {
    const [payload, signature] = parts;
    const [expectedSignature, decoded] = await Promise.all([
      hmac(payload),
      Promise.resolve(JSON.parse(new TextDecoder().decode(fromBase64Url(payload)))),
    ]);

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
