# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências do sistema necessárias para o build
RUN apk add --no-cache libc6-compat

# Copia os arquivos de configuração primeiro para aproveitar o cache
COPY package*.json ./

# Instala as dependências exatamente conforme o package-lock.json
RUN npm ci

# Copia os arquivos de configuração e código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage com Nginx
FROM node:20-alpine AS runner
WORKDIR /app

# Instala Nginx e outras dependências necessárias
RUN apk add --no-cache nginx supervisor bash

# Instala apenas as dependências de produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --omit=dev

# Copia os arquivos de build e públicos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Cria diretório para logs do Nginx
RUN mkdir -p /run/nginx /var/log/nginx

# Cria diretório para configuração do supervisor
RUN mkdir -p /etc/supervisor/conf.d

# Configura o Nginx como proxy reverso
COPY nginx.conf /etc/nginx/http.d/default.conf

# Configura as variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Define o backend URL
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Cria o arquivo de configuração do supervisor para gerenciar os processos
RUN echo "[supervisord]" > /etc/supervisor/conf.d/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "[program:nextjs]" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "command=npm start" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "directory=/app" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "autostart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisor/conf.d/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf

# Cria wrapper de inicialização para injetar variáveis de ambiente durante o runtime
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expõe a porta para o Nginx
EXPOSE 8080

# Comando para iniciar todos os serviços
CMD ["/app/entrypoint.sh"]