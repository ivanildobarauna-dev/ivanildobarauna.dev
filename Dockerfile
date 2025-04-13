# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependências do sistema necessárias para o build
RUN apk add --no-cache libc6-compat

# Copia os arquivos de configuração primeiro para aproveitar o cache
COPY package*.json ./

# Remove o package-lock.json para garantir instalação limpa
RUN rm -f package-lock.json

# Instala as dependências incluindo as de desenvolvimento
RUN npm install

# Instala explicitamente as dependências necessárias para o build com versões específicas
RUN npm install -D tailwindcss@latest postcss@latest autoprefixer@latest @types/node @types/react @types/react-dom typescript @tailwindcss/postcss7-compat

# Copia os arquivos de configuração e código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Instala apenas as dependências de produção
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copia os arquivos de build e públicos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Configura as variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Expõe a porta que o Cloud Run espera
EXPOSE 8080

# Cria wrapper de inicialização para injetar variáveis de ambiente durante o runtime
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Substituindo variáveis de ambiente nos arquivos JS..."' >> /app/start.sh && \
    echo 'find /app/.next/static -type f -name "*.js" -exec sed -i "s|NEXT_PUBLIC_BACKEND_URL:[^,]*|NEXT_PUBLIC_BACKEND_URL:\"$NEXT_PUBLIC_BACKEND_URL\"|g" {} \;' >> /app/start.sh && \
    echo 'echo "Iniciando o servidor..."' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Comando para iniciar a aplicação
CMD ["/app/start.sh"] 