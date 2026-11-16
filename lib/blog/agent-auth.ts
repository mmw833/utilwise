import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

type AgentEnv = { BLOG_AGENT_API_TOKEN?: string };
const encoder = new TextEncoder();

async function configuredToken(): Promise<string | undefined> {
  try {
    const context = await getCloudflareContext({ async: true });
    const value = (context.env as unknown as AgentEnv).BLOG_AGENT_API_TOKEN;
    if (value) return value;
  } catch {
    // The process environment is only a local-development fallback.
  }
  return (process.env as Record<string, string | undefined>).BLOG_AGENT_API_TOKEN;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) mismatch |= left[i] ^ right[i];
  return mismatch === 0;
}

export async function isBlogAgentAuthorized(request: Request): Promise<boolean> {
  const expected = await configuredToken();
  if (!expected || expected.length < 32) return false;

  const authorization = request.headers.get("authorization") || "";
  // Allow printable ASCII token characters so password-generator symbols work,
  // while rejecting whitespace and control characters in the HTTP header.
  const match = authorization.match(/^Bearer ([\x21-\x7E]{32,256})$/);
  if (!match) return false;

  const [expectedHash, suppliedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
    crypto.subtle.digest("SHA-256", encoder.encode(match[1])),
  ]);
  return constantTimeEqual(new Uint8Array(expectedHash), new Uint8Array(suppliedHash));
}
