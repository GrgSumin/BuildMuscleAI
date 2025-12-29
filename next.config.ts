import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Suppress middleware deprecation warning (middleware.ts still works in Next.js 16)
  experimental: {
    // This helps with Clerk middleware compatibility
  },
};

export default nextConfig;
