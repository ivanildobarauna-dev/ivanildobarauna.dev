#!/bin/bash
set -e

# Verificar se os diretórios necessários existem
mkdir -p /run/nginx
mkdir -p /var/log/nginx

# Listar diretórios para debug
echo "Listando diretório /app para debug..."
ls -la /app
echo "Listando diretório /app/.next se existir..."
if [ -d "/app/.next" ]; then
  ls -la /app/.next
else
  echo ".next não existe, executando build..."
  npm run build
fi

# Verificar a configuração do Nginx
echo "Verificando configuração do Nginx..."
nginx -t

# Iniciar o supervisor que gerenciará o Nginx e o servidor Next.js
echo "Iniciando serviços..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf