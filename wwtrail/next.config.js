/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // Type errors now fail the build (the codebase typechecks clean).
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint is not yet clean; keep it from blocking builds for now.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '**.digitalocean.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Increase body size limit for file uploads via API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

// next-intl configuration
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

module.exports = withNextIntl(nextConfig);
