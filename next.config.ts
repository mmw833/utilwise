import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {};

export default nextConfig;

// Required by OpenNext to expose local Cloudflare bindings during next dev.
initOpenNextCloudflareForDev();
