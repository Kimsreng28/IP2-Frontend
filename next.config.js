/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "cdn-icons-png.flaticon.com",
      "cdn.sanity.io",
      "images.pexels.com", // ✅ Add this line
      "localhost"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // ✅ Add this for better safety (optional if domains is enough)
        port: "",
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    FILE_BASE_URL: process.env.FILE_BASE_URL,
    RecaptchaSiteKey: process.env.RecaptchaSiteKey,
  },
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:8080",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/client",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
