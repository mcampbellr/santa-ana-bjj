# Usa una imagen base oficial de Node.js
FROM node:20-alpine AS builder

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Instala dependencias
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    else yarn install; fi

# Copia el resto del código
COPY . .

# Construye la aplicación
RUN yarn build

# Etapa final (más liviana)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia solo lo necesario del builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]

