# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
RUN npm install --production

EXPOSE 3001
CMD ["node", "dist/main.js"]
