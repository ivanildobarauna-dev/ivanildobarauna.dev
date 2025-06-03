/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://backend:8090/api/v1/:path*',
      },
    ];
  },
}

module.exports = nextConfig 
