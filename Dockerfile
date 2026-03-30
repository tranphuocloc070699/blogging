FROM node:22-alpine

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate --schema=prisma/schema/main.prisma

RUN pnpm run build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy --schema=prisma/schema/main.prisma && node_modules/.bin/next start"]
