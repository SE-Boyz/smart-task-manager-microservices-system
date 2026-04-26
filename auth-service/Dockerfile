# syntax=docker/dockerfile:1
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 5001
CMD ["node", "dist/server.js"]
