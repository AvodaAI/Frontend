/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable new Next.js features
    reactCompiler: true
  },
  // Database packages should only be used in server components
  serverComponentsExternalPackages: ['pg', 'postgres'],
  typescript: {
    ignoreBuildErrors: false
  },
  // Handle any potential module resolution issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false, crypto: false };
    return config;
  }
}

module.exports = nextConfig
