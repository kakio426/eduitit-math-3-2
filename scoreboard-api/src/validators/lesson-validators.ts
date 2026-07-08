import type { ProgressRule } from "./progress-lesson-validator"
import { validateProgressLesson } from "./progress-lesson-validator"
import type { RewardEvent } from "./schemas"
import type { LessonValidationInput, LessonValidationResult } from "./validation-core"
import {
  findStructuralFlags,
  isPerfectAnswer,
  reject,
  VALIDATION_STATUS,
  validateReward,
} from "./validation-core"

export type {
  LessonValidationInput,
  LessonValidationResult,
  ValidationStatus,
} from "./validation-core"
export { VALIDATION_STATUS } from "./validation-core"

const BOX_REWARD_RULES = [
  { id: "add_100", min: 100, max: 100 },
  { id: "add_1000", min: 1_000, max: 1_000 },
  { id: "add_100000", min: 100_000, max: 100_000 },
  { id: "subtract_500", min: -500, max: -500 },
  { id: "subtract_5000", min: -5_000, max: -5_000 },
  { id: "subtract_100000", min: -100_000, max: -100_000 },
  { id: "multiply_2", min: 2, max: 2 },
  { id: "multiply_5", min: 5, max: 5 },
  { id: "multiply_10", min: 10, max: 10 },
  { id: "divide_2", min: 2, max: 2 },
  { id: "divide_3", min: 3, max: 3 },
  { id: "rescue", min: 500, max: 500 },
  { id: "zero", min: 0, max: 0, empties: true },
  { id: "broken", min: -50_000_000_000, max: 100 },
] as const

const ROCKET_RULE: ProgressRule = {
  baseForPerfect: 0,
  maxScore: 100,
  mistakeId: "leak",
  earlyFinishRewardId: "instantLaunch",
  rules: [
    { id: "normal", min: 4, max: 8 },
    { id: "smallExplosion", min: -10, max: -5 },
    { id: "megaFuel", min: 12, max: 20 },
    { id: "instantLaunch", min: 6, max: 6 },
    { id: "emptyTank", min: 0, max: 0, empties: true },
    { id: "rainbowFuel", min: 10, max: 10 },
    { id: "leak", min: -18, max: -8 },
  ],
}

const ISLAND_RULE: ProgressRule = {
  baseForPerfect: 5,
  maxScore: 100,
  mistakeId: "shaky",
  rules: [
    { id: "tailwind", min: 2, max: 5 },
    { id: "headwind", min: -8, max: -4 },
    { id: "pause", min: 0, max: 0, pause: true },
    { id: "gust", min: 8, max: 13 },
    { id: "rainbow", min: 14, max: 14 },
    { id: "shaky", min: -14, max: -8 },
  ],
}

const FUSION_RULE: ProgressRule = {
  baseForPerfect: 0,
  maxScore: 8000,
  mistakeId: "leak",
  rules: [
    { id: "normal", min: 50, max: 100 },
    { id: "smallExplosion", min: -50, max: -50 },
    { id: "megaFuel", min: 200, max: 200 },
    { id: "instantLaunch", min: 500, max: 500 },
    { id: "emptyTank", min: 0, max: 0 },
    { id: "rainbowFuel", min: 800, max: 800 },
    { id: "leak", min: -100, max: -100 },
  ],
}

const FRACTION_RULE: ProgressRule = {
  baseForPerfect: 0,
  maxScore: 100,
  mistakeId: "leak",
  earlyFinishRewardId: "instantLaunch",
  rules: [
    { id: "normal", min: 4, max: 8 },
    { id: "smallExplosion", min: -10, max: -5 },
    { id: "megaFuel", min: 12, max: 20 },
    { id: "instantLaunch", min: 6, max: 6 },
    { id: "emptyTank", min: 0, max: 0, empties: true },
    { id: "rainbowFuel", min: 10, max: 10 },
    { id: "leak", min: -18, max: -8 },
  ],
}
const CIRCLE_RULE: ProgressRule = FRACTION_RULE

const applyBoxReward = (score: bigint, reward: RewardEvent): bigint => {
  switch (reward.id) {
    case "add_100":
    case "add_1000":
    case "add_100000":
    case "subtract_500":
    case "subtract_5000":
    case "subtract_100000":
      return score + BigInt(reward.amount)
    case "multiply_2":
    case "multiply_5":
    case "multiply_10":
      return score * BigInt(reward.amount)
    case "divide_2":
    case "divide_3":
      return score / BigInt(reward.amount)
    case "rescue":
      return score < 0n ? -score : score + BigInt(reward.amount)
    case "zero":
      return 0n
    case "broken":
      return score + BigInt(reward.amount)
    default:
      return score
  }
}

const validateBoxRun = (input: LessonValidationInput): LessonValidationResult => {
  const structuralFlags = findStructuralFlags(input.answers, input.playTimeMs)
  if (structuralFlags.length > 0) return reject(structuralFlags)

  const flags: string[] = []
  let score = 0n
  let combo = 0
  let correctCount = 0

  for (const answer of input.answers) {
    const perfect = isPerfectAnswer(answer)
    const rewardFlags = validateReward(answer.reward, BOX_REWARD_RULES, perfect, "broken")
    flags.push(...rewardFlags)
    if (!answer.reward) continue
    if (perfect) {
      combo += 1
      correctCount += 1
      score += 100n * BigInt(Math.min(combo, 5))
    } else {
      combo = 0
    }
    score = applyBoxReward(score, answer.reward)
  }

  if (flags.length > 0) return reject([...new Set(flags)])
  return {
    status: VALIDATION_STATUS.accepted,
    score,
    correctCount,
    maxScore: 50_000_000_000n,
    flagReasons: [],
  }
}

export const validateLessonSubmission = (input: LessonValidationInput): LessonValidationResult => {
  switch (input.lessonId) {
    case "3-2-1-1-mathmon-box-run":
      return validateBoxRun(input)
    case "3-2-1-2-mathmon-rocket-charge":
      return validateProgressLesson(input, ROCKET_RULE)
    case "3-2-1-3-mathmon-jump-islands":
      return validateProgressLesson(input, ISLAND_RULE)
    case "3-2-1-4-mathmon-fusion":
      return validateProgressLesson(input, FUSION_RULE)
    case "3-2-3-1-mathmon-target-hit":
    case "3-2-3-2-mathmon-compass-ring":
    case "3-2-3-3-mathmon-double-bridge":
    case "3-2-3-4-mathmon-circle-pattern":
      return validateProgressLesson(input, CIRCLE_RULE)
    case "3-2-4-1-mathmon-pizza-fraction":
    case "3-2-4-2-mathmon-fraction-scoop":
    case "3-2-4-3-mathmon-fraction-sorter":
    case "3-2-4-4-mathmon-fraction-tug":
      return validateProgressLesson(input, FRACTION_RULE)
    default:
      return reject(["unsupported_lesson"])
  }
}
