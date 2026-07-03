# =============================================================
# Stage 1: Build do Frontend (React + Vite)
# =============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhor cache)
COPY package.json package-lock.json ./

RUN npm ci

# Copia o código-fonte do frontend
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js ./
COPY src/ ./src/
COPY public/ ./public/

# Argumento de build: URL base da API em produção
# Defina no EasyPanel: VITE_API_URL=https://seu-dominio.com
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# =============================================================
# Stage 2: Runtime do Backend (Node.js + Express)
# =============================================================
FROM node:20-alpine AS runtime

WORKDIR /app/backend

# Copia arquivos de dependência do backend
COPY backend/package.json backend/package-lock.json ./

# Instala ferramentas de build necessárias para better-sqlite3 (node-gyp)
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev \
    && apk del make g++

# Copia o código do backend
COPY backend/server.js ./
COPY backend/database.js ./
COPY backend/auth.js ./
COPY backend/routes/ ./routes/

# Copia o build do frontend para ser servido pelo backend
COPY --from=builder /app/dist ./public/

# Cria diretório de uploads e dados (serão montados como volume no EasyPanel)
RUN mkdir -p uploads data

# Porta exposta
EXPOSE 3001

# Variáveis de ambiente (com defaults seguros)
ENV PORT=3001
ENV NODE_ENV=production

# Inicia o servidor
CMD ["node", "server.js"]
