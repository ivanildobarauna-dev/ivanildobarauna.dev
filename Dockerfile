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

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 