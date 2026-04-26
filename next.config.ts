import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  // Fix: "multiple lockfiles" warning when project is inside a subfolder
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
