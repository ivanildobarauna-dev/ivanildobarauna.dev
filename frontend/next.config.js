/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const backendHost = isDevelopment ? 'localhost' : 'backend';
    
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://${backendHost}:8090/api/v1/:path*`,
      },
    ];
  },
}

module.exports = nextConfig 
