import { createBlogRss } from "@/lib/blog/rss";
export const dynamic = "force-dynamic";
export async function GET() { return createBlogRss("ko"); }
