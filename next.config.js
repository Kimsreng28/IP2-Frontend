// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    FILE_BASE_URL: process.env.FILE_BASE_URL,
    RecaptchaSiteKey: process.env.RecaptchaSiteKey,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/client',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
