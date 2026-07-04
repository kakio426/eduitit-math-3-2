import type { LessonValidationInput, LessonValidationResult, RewardRule } from "./validation-core"
import {
  clamp,
  findRewardRule,
  findStructuralFlags,
  isPerfectAnswer,
  reject,
  VALIDATION_STATUS,
  validateReward,
} from "./validation-core"

export type ProgressRule = {
  readonly rules: readonly RewardRule[]
  readonly mistakeId: string
  readonly baseForPerfect: number
  readonly maxScore: number
  readonly earlyFinishRewardId?: string
}

export const validateProgressLesson = (
  input: LessonValidationInput,
  progressRule: ProgressRule,
): LessonValidationResult => {
  const structuralFlags = findStructuralFlags(
    input.answers,
    input.playTimeMs,
    progressRule.earlyFinishRewardId,
  )
  if (structuralFlags.length > 0) return reject(structuralFlags)

  const flags: string[] = []
  let score = 0
  let correctCount = 0

  for (const answer of input.answers) {
    const perfect = isPerfectAnswer(answer)
    const rewardFlags = validateReward(
      answer.reward,
      progressRule.rules,
      perfect,
      progressRule.mistakeId,
    )
    flags.push(...rewardFlags)
    if (!answer.reward) continue

    const rule = findRewardRule(progressRule.rules, answer.reward)
    if (!rule) continue
    if (perfect) correctCount += 1
    if (rule.empties) {
      score = 0
    } else {
      const base = perfect && !rule.pause ? progressRule.baseForPerfect : 0
      score = clamp(score + base + answer.reward.amount, 0, progressRule.maxScore)
    }
  }

  if (flags.length > 0) return reject([...new Set(flags)])
  return {
    status: VALIDATION_STATUS.accepted,
    score: BigInt(score),
    correctCount,
    maxScore: BigInt(progressRule.maxScore),
    flagReasons: [],
  }
}
