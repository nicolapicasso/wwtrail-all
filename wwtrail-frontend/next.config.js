/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wwtrail.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wwtrail.com',
        pathname: '/api/uploads/**',
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
    ],
  },
}

// Configuración de next-intl
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

module.exports = withNextIntl(nextConfig);
