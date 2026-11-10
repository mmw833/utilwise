import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PRODUCTION_HOSTS = new Set(["utilwise.kr", "www.utilwise.kr", "utilwise.mmw833.workers.dev"]);
const LOCAL_DEVELOPMENT_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const PREVIEW_USERNAME = "preview";

function unauthorizedResponse(): NextResponse {
  return new NextResponse("Preview access requires a password.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="UTILWISE Preview", charset="UTF-8"',
      "Cache-Control": "no-store, private",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  // The public production domains and local development remain unchanged.
  // Every other hostname (including Cloudflare branch/PR preview URLs) is gated.
  if (
    PUBLIC_PRODUCTION_HOSTS.has(hostname) ||
    LOCAL_DEVELOPMENT_HOSTS.has(hostname)
  ) {
    return NextResponse.next();
  }

  const previewPassword = process.env.PREVIEW_ACCESS_PASSWORD;

  // Fail closed: a preview without its dedicated secret must not become public.
  if (!previewPassword || previewPassword.length < 24) {
    return new NextResponse("Preview access is not configured.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store, private",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Basic ")) return unauthorizedResponse();

  try {
    const credentials = atob(authorization.slice(6));
    const separator = credentials.indexOf(":");
    if (separator < 0) return unauthorizedResponse();

    const username = credentials.slice(0, separator);
    const password = credentials.slice(separator + 1);

    if (username !== PREVIEW_USERNAME || password !== previewPassword) {
      return unauthorizedResponse();
    }
  } catch {
    return unauthorizedResponse();
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
