#!/bin/bash
set -e

# Verificar se os diretórios necessários existem
mkdir -p /run/nginx
mkdir -p /var/log/nginx

# Verificar a configuração do Nginx
echo "Verificando configuração do Nginx..."
nginx -t

# Criar ou atualizar o arquivo .env.local para injetar variáveis em runtime
echo "NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}" > /app/.env.local
echo "Variáveis de ambiente configuradas: NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}"

# Iniciar o supervisor que gerenciará o Nginx e o servidor Next.js
echo "Iniciando serviços..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf