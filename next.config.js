const { withSentryConfig } = require("@sentry/nextjs");/** @type {import('next').NextConfig}  */
const nextConfig = {};

module.exports = withSentryConfig(nextConfig, {
  org: "ca6",
  project: "avoda",
  silent: false, // Can be used to suppress logs
});
