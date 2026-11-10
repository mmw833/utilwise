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
  BLOG_IMAGES?: R2BucketLike;
};

export interface R2BucketLike {
  put(key: string, value: ArrayBuffer | ArrayBufferView | ReadableStream, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string }; httpEtag?: string; etag?: string } | null>;
}

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

export function getBlogImageBucket(): R2BucketLike {
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as BlogCloudflareEnv).BLOG_IMAGES;
  if (!bucket) throw new Error("Cloudflare R2 binding BLOG_IMAGES is not configured.");
  return bucket;
}
