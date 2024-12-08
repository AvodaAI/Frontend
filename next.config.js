/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

// Determine environment based on git branch
const getEnvironment = () => {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'development';
  if (branch === 'master' || branch === 'main') {
    return 'production';
  }
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

const sentryBuildOptions = {
  org: 'ca6', // Replace with your Sentry organization
  project: 'avoda', // Replace with your Sentry project name
};

const sentryWebpackPluginOptions = {
  org: 'ca6', // Replace with your Sentry organization
  project: 'avoda', // Replace with your Sentry project name
  authToken: process.env.SENTRY_AUTH_TOKEN, // Use environment variables for sensitive data
  release: process.env.SENTRY_RELEASE || '1.0.0',
  deploy: {
    env: getEnvironment(),
  },
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryBuildOptions);
