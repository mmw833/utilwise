import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Result<T> {
  results?: T[];
  success: boolean;
  meta?: {
    changes?: number;
    duration?: number;
  };
}

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

type BlogCloudflareEnv = {
  BLOG_DB: D1Database;
};

/**
 * Resolve the D1 binding at request time. Never call this at module scope:
 * Cloudflare bindings exist only inside the Worker request context.
 */
export function getBlogDatabase(): D1Database {
  const { env } = getCloudflareContext();
  const blogEnv = env as unknown as BlogCloudflareEnv;

  if (!blogEnv.BLOG_DB) {
    throw new Error("Cloudflare D1 binding BLOG_DB is not configured.");
  }

  return blogEnv.BLOG_DB;
}
