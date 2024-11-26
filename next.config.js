/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  // Handle any potential module resolution issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false, crypto: false };
    return config;
  }
}

module.exports = nextConfig
