import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dummy image sources — replace with your own storage later.
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "picsum.photos" },
      // Book covers uploaded through the Add Book form (imgbb).
      { protocol: "https", hostname: "i.ibb.com" },
      { protocol: "https", hostname: "i.imgbb.com" },
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
