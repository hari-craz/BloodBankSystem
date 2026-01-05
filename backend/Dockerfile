# Backend API
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY backend .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
