# Etapa de build
FROM node:20-slim AS builder

WORKDIR /app

# Instala dependências de sistema mínimas (evita problemas com libs nativas)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copia apenas o package.json
COPY package.json ./

# Instala todas as dependências e gera o package-lock.json, incluindo devDependencies para o build
RUN npm install --no-audit --no-fund --verbose

# Copia o restante do projeto
COPY . .

# Build do Next.js
RUN npm run build

# Etapa de produção
FROM node:20-slim AS runner

WORKDIR /app

# Copia artefatos do build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Apenas dependencies
RUN npm install --omit=dev --no-audit --prefer-offline

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node_modules/.bin/next", "start", "-p", "8080"]
