import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    cacheLife: {
      status: {
        stale: 120,
        revalidate: 60,
        expire: 60,
      }
    }
  },
};

export default nextConfig;
