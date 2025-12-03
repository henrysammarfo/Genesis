import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable React compiler to reduce memory usage during build
  // reactCompiler: true,
};

export default nextConfig;
