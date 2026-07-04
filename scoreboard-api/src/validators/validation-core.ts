import type { LessonId } from "../domain/lessons"
import type { AnswerLogItem, RewardEvent } from "./schemas"

export const VALIDATION_STATUS = {
  accepted: "accepted",
  flagged: "flagged",
  rejected: "rejected",
} as const

export type ValidationStatus = (typeof VALIDATION_STATUS)[keyof typeof VALIDATION_STATUS]

export type LessonValidationInput = {
  readonly lessonId: LessonId
  readonly seed: number
  readonly answers: readonly AnswerLogItem[]
  readonly playTimeMs: number
}

export type LessonValidationResult = {
  readonly status: ValidationStatus
  readonly score: bigint
  readonly correctCount: number
  readonly maxScore: bigint
  readonly flagReasons: readonly string[]
}

export type RewardRule = {
  readonly id: string
  readonly min: number
  readonly max: number
  readonly empties?: true
  readonly pause?: true
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

export const isPerfectAnswer = (answer: AnswerLogItem): boolean =>
  answer.steps.every((step) => String(step.selected) === String(step.expected))

export const reject = (flagReasons: readonly string[]): LessonValidationResult => ({
  status: VALIDATION_STATUS.rejected,
  score: 0n,
  correctCount: 0,
  maxScore: 0n,
  flagReasons,
})

export const findStructuralFlags = (
  answers: readonly AnswerLogItem[],
  playTimeMs: number,
  earlyFinishRewardId = "",
): readonly string[] => {
  const flags: string[] = []
  const lastRewardId = answers.at(-1)?.reward?.id
  const allowsEarlyFinish = lastRewardId === earlyFinishRewardId
  if (answers.length !== 10 && !allowsEarlyFinish) flags.push("answer_count_must_be_10")
  if (playTimeMs < 5_000) flags.push("play_time_too_short")

  const seen = new Set<number>()
  for (const answer of answers) {
    if (seen.has(answer.questionIndex)) flags.push("duplicate_question_index")
    seen.add(answer.questionIndex)
  }
  return flags
}

export const findRewardRule = (
  rules: readonly RewardRule[],
  reward: RewardEvent,
): RewardRule | null => rules.find((rule) => rule.id === reward.id) ?? null

export const validateReward = (
  reward: RewardEvent | undefined,
  rules: readonly RewardRule[],
  perfect: boolean,
  mistakeId: string,
): readonly string[] => {
  if (!reward) return ["missing_reward_event"]
  const rule = findRewardRule(rules, reward)
  if (!rule) return ["unknown_reward_event"]
  if (perfect && reward.id === mistakeId) return ["reward_not_allowed_for_answer"]
  if (!perfect && reward.id !== mistakeId) return ["reward_not_allowed_for_answer"]
  if (reward.amount < rule.min || reward.amount > rule.max) return ["reward_amount_out_of_range"]
  return []
}
