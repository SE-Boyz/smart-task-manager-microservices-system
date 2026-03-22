# syntax=docker/dockerfile:1
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm sh -c "for attempt in 1 2 3; do npm ci --prefer-offline --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000 && exit 0; echo \"npm ci failed on attempt ${attempt}, retrying...\"; sleep 5; done; exit 1"
COPY . .
RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 5005
CMD ["node", "dist/server.js"]
