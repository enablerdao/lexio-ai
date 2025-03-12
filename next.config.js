/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://localhost:54728/:path*',
      },
    ];
  },
};

module.exports = nextConfig;