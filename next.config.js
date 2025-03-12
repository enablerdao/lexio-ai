/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only use rewrites in development mode
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: '/backend-api/:path*',
          destination: 'http://localhost:54728/:path*',
        },
      ];
    },
  }),
  // For Netlify
  trailingSlash: true,
};

module.exports = nextConfig;