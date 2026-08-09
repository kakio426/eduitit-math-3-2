import { createHash } from "node:crypto"
import { z } from "zod"

export const ParticipationCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Z0-9]{4,12}$/)
  .brand("ParticipationCode")

export type ParticipationCode = z.infer<typeof ParticipationCodeSchema>

export const parseParticipationCode = (value: string): ParticipationCode =>
  ParticipationCodeSchema.parse(value.trim().toUpperCase())

export const hashParticipationCode = (code: ParticipationCode): string =>
  createHash("sha256").update(code).digest("hex")
