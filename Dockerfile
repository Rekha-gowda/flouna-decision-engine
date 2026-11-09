# Mini FLOUNA Decision Engine - Production Dockerfile
# Author: G. Rekha (Rekha-gowda)

FROM node:18-alpine AS builder

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install and build frontend
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

# Final production runner
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/index.js"]
