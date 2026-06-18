# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json ./package.json
RUN npm install

COPY . .
RUN npx next build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npx", "next", "start"]
