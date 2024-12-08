/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

// Determine environment based on git branch
const getEnvironment = () => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'development';
  if (branch === 'master' || branch === 'main') {
    return 'production';
  }
  console.log(branch)
  return 'staging';
};

const nextConfig = {
  experimental: {
  },
  // Handle any potential module resolution issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false, crypto: false };
    return config;
  }
}

getEnvironment();


module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryBuildOptions);
