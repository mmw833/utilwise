import { NextRequest } from "next/server";
import { getBlogImageBucket } from "@/lib/blog/db";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ key: string[] }> };
export async function GET(_request: NextRequest, context: Context) {
  const { key: parts } = await context.params;
  if (!Array.isArray(parts) || parts.length !== 2 || parts[0] !== "blog" || !/^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(parts[1])) return new Response("Not found",{status:404});
  try {
    const object=await getBlogImageBucket().get(parts.join("/"));
    if (!object) return new Response("Not found",{status:404});
    const headers=new Headers({"Content-Type":object.httpMetadata?.contentType || "application/octet-stream","Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"});
    const etag=object.httpEtag || object.etag;
    if (etag) headers.set("ETag",etag);
    return new Response(object.body,{headers});
  } catch { return new Response("Image unavailable",{status:503}); }
}
