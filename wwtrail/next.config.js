/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wwtrail.com',
        pathname: '/uploads/**',
      },
      // DigitalOcean Spaces CDN
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdn.digitaloceanspaces.com',
      },
      // External image sources for special series logos
      {
        protocol: 'https',
        hostname: 'www.goldentrailseries.com',
      },
      {
        protocol: 'https',
        hostname: 'utmb.world',
      },
      {
        protocol: 'https',
        hostname: 'www.skyrunner.com',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
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
