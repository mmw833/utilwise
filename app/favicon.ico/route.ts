const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#22292a"/><path d="M13 15h8v21c0 7 3 11 9 11s9-4 9-11V15h8v22c0 12-6 19-17 19S13 49 13 37V15z" fill="#fff"/><path d="M48 15h7v34h-7z" fill="#526f89"/></svg>`;

export function GET() {
  return new Response(faviconSvg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
