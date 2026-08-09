import { randomUUID } from "node:crypto"
import { z } from "zod"

export const SessionIdSchema = z.string().uuid().brand("SessionId")
export type SessionId = z.infer<typeof SessionIdSchema>

export const SubmissionIdSchema = z.string().uuid().brand("SubmissionId")
export type SubmissionId = z.infer<typeof SubmissionIdSchema>

export const createSessionId = (): SessionId => SessionIdSchema.parse(randomUUID())
export const createSubmissionId = (): SubmissionId => SubmissionIdSchema.parse(randomUUID())
