FROM oven/bun:1.3.14

WORKDIR /app/scoreboard-api

COPY scoreboard-api/package.json scoreboard-api/bun.lock ./
COPY scoreboard-api/prisma ./prisma

RUN bun install --frozen-lockfile

COPY scoreboard-api ./

RUN bun run prisma:generate && bun run build

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
