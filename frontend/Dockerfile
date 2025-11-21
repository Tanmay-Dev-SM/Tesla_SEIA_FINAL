FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime image ----
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
EXPOSE 8000

COPY --from=builder /app ./

# "start" already has -p 8000 in package.json
CMD ["npm", "start"]