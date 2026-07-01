import { z } from "zod"

const AnswerValueSchema = z.union([z.number().int(), z.string().min(1).max(64)])

export const StepAnswerSchema = z.object({
  stepId: z.string().min(1).max(48),
  selected: AnswerValueSchema,
  expected: AnswerValueSchema,
  elapsedMs: z.number().int().min(0).max(600_000),
})

export const RewardEventSchema = z.object({
  id: z.string().min(1).max(48),
  amount: z.number().int(),
})

export const AnswerLogItemSchema = z.object({
  questionIndex: z.number().int().min(0).max(9),
  elapsedMs: z.number().int().min(0).max(1_800_000),
  steps: z.array(StepAnswerSchema).min(1).max(4),
  reward: RewardEventSchema.optional(),
})

export const AnswerLogSchema = z.array(AnswerLogItemSchema).min(1).max(10)

export type AnswerValue = z.infer<typeof AnswerValueSchema>
export type StepAnswer = z.infer<typeof StepAnswerSchema>
export type RewardEvent = z.infer<typeof RewardEventSchema>
export type AnswerLogItem = z.infer<typeof AnswerLogItemSchema>
