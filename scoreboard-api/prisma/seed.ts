import { PrismaClient } from "@prisma/client"

import { LESSONS } from "../src/domain/lessons"

const prisma = new PrismaClient()

for (const lesson of LESSONS) {
  await prisma.lesson.upsert({
    where: { id: lesson.id },
    create: lesson,
    update: {
      title: lesson.title,
      active: lesson.active,
    },
  })
}

await prisma.$disconnect()
