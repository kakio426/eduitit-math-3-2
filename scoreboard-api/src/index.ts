import { PrismaClient } from "@prisma/client"

import { createApp } from "./app"
import { createPrismaRepository } from "./repositories/prisma-repository"

const prisma = new PrismaClient()
const frontendOrigins = (Bun.env["FRONTEND_ORIGINS"] ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)

const app = createApp({
  repository: createPrismaRepository(prisma),
  frontendOrigins,
})

const port = Number.parseInt(Bun.env["PORT"] ?? "3000", 10)

Bun.serve({
  port,
  fetch: app.fetch,
})

console.log(`Mathmon scoreboard API listening on ${port}`)
