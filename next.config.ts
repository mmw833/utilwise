import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Transformers.js runs in the browser-side background remover only.
  // Keep it out of the Next.js server bundle so optional Node ONNX native
  // bindings are not pulled into the Cloudflare Worker build.
  serverExternalPackages: ["@huggingface/transformers"],
};

export default nextConfig;

// Required by OpenNext to expose local Cloudflare bindings during next dev.
initOpenNextCloudflareForDev();
