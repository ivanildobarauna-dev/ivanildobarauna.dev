# Etapa de build
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --no-audit --no-fund --verbose

COPY . .
RUN npm run build

# Etapa de produção
FROM node:20-slim AS runner

WORKDIR /app

# Copia artefatos do build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Copia tracer
COPY ./tracer /tracer
RUN cd /tracer && npm install


RUN npm install --omit=dev --no-audit --prefer-offline

# Injeção automática via NODE_OPTIONS
ENV NODE_OPTIONS="-r /tracer/tracing.js"
ENV NODE_ENV=production
ENV PORT=8081
EXPOSE 8081

CMD ["node_modules/.bin/next", "start", "-p", "8081"]
