// Configuração local que estende a configuração principal
const nextConfig = require('./next.config.js');

// Modificações apenas para ambiente local
const localConfig = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://host.docker.internal:8090/api/v1/:path*',
      },
    ];
  },
  // Desativa a otimização de imagens para evitar problemas locais
  images: {
    unoptimized: true,
  },
};

module.exports = localConfig;
