# Build stage
FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma/ ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Production stage
FROM node:18-bullseye AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
