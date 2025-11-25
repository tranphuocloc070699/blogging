# Simple & bulletproof Dockerfile – no standalone nonsense
FROM node:20-alpine

# Install libc (needed by Prisma on Alpine)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (supports npm, pnpm, yarn)
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    npm ci; \
  else \
    npm install; \
  fi

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js app
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    pnpm run build; \
  else \
    npm run build; \
  fi

# Create non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# This is the classic way – no standalone, just run next start
CMD ["node_modules/.bin/next", "start"]