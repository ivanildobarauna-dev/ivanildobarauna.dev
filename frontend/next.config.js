/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  
  // Configuração do proxy para redirecionar requisições /api/v1 para o backend
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://backend:8090/api/v1/:path*',
      },
    ];
  },
  
  // Configurações de CORS para desenvolvimento
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

// Verifica se estamos em desenvolvimento e aplica configurações adicionais
const isDev = process.env.NODE_ENV !== 'production';
if (isDev) {
  // Configurações específicas para desenvolvimento
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
