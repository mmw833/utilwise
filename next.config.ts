import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Serve the existing PNG icon bytes at the legacy .ico URL. The .ico
        // asset currently falls through to the homepage in the Workers build.
        { source: "/favicon.ico", destination: "/favicon-32x32.png" },
      ],
    };
  },
};

export default nextConfig;

// Required by OpenNext to expose local Cloudflare bindings during next dev.
initOpenNextCloudflareForDev();
