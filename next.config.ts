import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dummy image sources — replace with your own storage later.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "**" },
      // Book covers uploaded through the Add Book form (imgbb).
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
