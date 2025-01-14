import withsentryConfig from "@sentry/nextjs";

/** @type {import('next').NextConfig}  */
const nextConfig = {};

module.exports = withsentryConfig(nextConfig, {
  org: "ca6",
  project: "avoda",
  silent: false, // Can be used to suppress logs
});
