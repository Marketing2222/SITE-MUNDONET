# =============================================================
# Stage 1: Build do Frontend (React + Vite)
# =============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js ./
COPY src/ ./src/
COPY public/ ./public/

ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# =============================================================
# Stage 2: Runtime do Backend (Node.js + Express)
# =============================================================
FROM node:20-alpine AS runtime

WORKDIR /app

# Copia o backend inteiro (package.json, server.js, database.js, auth.js, routes/)
COPY backend/ ./backend/

WORKDIR /app/backend

RUN npm ci --omit=dev

# Copia o build do frontend para ser servido pelo backend
COPY --from=builder /app/dist ./public/

RUN mkdir -p uploads data

EXPOSE 80

ENV PORT=80
ENV NODE_ENV=production

CMD ["node", "server.js"]
