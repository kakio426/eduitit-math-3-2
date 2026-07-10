import type { AnswerLogItem, RewardEvent } from "./schemas"
import type { LessonValidationInput, LessonValidationResult } from "./validation-core"
import { clamp, findStructuralFlags, reject, VALIDATION_STATUS } from "./validation-core"

export const FUSION_MAX_SCORE = 8_000

const PROBLEM_SEED_SALT = 0x4655_5331
const REWARD_SEED_SALT = 0x4655_5352
const QUESTION_SEED_STEP = 0x9e37_79b1

export type FusionProblem = {
  readonly type: "singleByTwo" | "twoByTwo"
  readonly top: number
  readonly bottom: number
  readonly onesMul: number
  readonly tensMul: number
  readonly partial1: number
  readonly partial2Core: number
  readonly partial2: number
  readonly answer: number
  readonly misplacedSum: number
}

type FusionExpectedStep = {
  readonly id: "partial1" | "partial2" | "fusion"
  readonly expected: number
}

const createSeededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b_79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

const mixSeed = (seed: number, salt: number): number => {
  let mixed = (seed ^ salt) >>> 0
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9_f3b)
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9_f3b)
  mixed = (mixed ^ (mixed >>> 16)) >>> 0
  return mixed || 1
}

const randomInt = (random: () => number, min: number, max: number): number =>
  Math.floor(random() * (max - min + 1)) + min

const randomTwoDigitNonRound = (random: () => number): number => {
  let value = 10
  while (value % 10 === 0) value = randomInt(random, 12, 99)
  return value
}

const shuffle = <T>(items: readonly T[], random: () => number): readonly T[] => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomInt(random, 0, index)
    const currentValue = result[index]
    const otherValue = result[other]
    if (currentValue === undefined || otherValue === undefined) continue
    result[index] = otherValue
    result[other] = currentValue
  }
  return result
}

const createProblem = (top: number, bottom: number, type: FusionProblem["type"]): FusionProblem => {
  const onesMul = bottom % 10
  const tensMul = Math.floor(bottom / 10)
  const partial1 = top * onesMul
  const partial2Core = top * tensMul
  const partial2 = partial2Core * 10
  const answer = partial1 + partial2
  return {
    type,
    top,
    bottom,
    onesMul,
    tensMul,
    partial1,
    partial2Core,
    partial2,
    answer,
    misplacedSum: partial1 + partial2Core,
  }
}

const addUniqueProblem = (
  problems: FusionProblem[],
  used: Set<string>,
  random: () => number,
  type: FusionProblem["type"],
): void => {
  while (true) {
    const top = type === "singleByTwo" ? randomInt(random, 2, 9) : randomTwoDigitNonRound(random)
    const bottom = randomTwoDigitNonRound(random)
    const key = `${top}:${bottom}`
    if (used.has(key)) continue
    used.add(key)
    problems.push(createProblem(top, bottom, type))
    return
  }
}

export const buildFusionProblems = (seed: number): readonly FusionProblem[] => {
  const random = createSeededRandom(mixSeed(seed, PROBLEM_SEED_SALT))
  const problems: FusionProblem[] = []
  const used = new Set<string>()
  for (let index = 0; index < 5; index += 1) {
    addUniqueProblem(problems, used, random, "singleByTwo")
    addUniqueProblem(problems, used, random, "twoByTwo")
  }
  return shuffle(problems, random)
}

export const getFusionRewardForQuestion = (seed: number, questionIndex: number): RewardEvent => {
  const questionSalt = REWARD_SEED_SALT ^ Math.imul(questionIndex + 1, QUESTION_SEED_STEP)
  const random = createSeededRandom(mixSeed(seed, questionSalt))
  const roll = random() * 100
  if (roll < 44) return { id: "normal", amount: 50 }
  if (roll < 68) return { id: "normal", amount: 100 }
  if (roll < 78) return { id: "smallExplosion", amount: -50 }
  if (roll < 88) return { id: "megaFuel", amount: 200 }
  if (roll < 93) return { id: "instantLaunch", amount: 500 }
  if (roll < 97) return { id: "emptyTank", amount: 0 }
  return { id: "rainbowFuel", amount: 800 }
}

const getExpectedSteps = (problem: FusionProblem): readonly FusionExpectedStep[] => [
  { id: "partial1", expected: problem.partial1 },
  { id: "partial2", expected: problem.partial2 },
  { id: "fusion", expected: problem.answer },
]

const inspectFusionAnswer = (
  answer: AnswerLogItem,
  problem: FusionProblem,
): { readonly perfect: boolean; readonly flags: readonly string[] } => {
  const expectedSteps = getExpectedSteps(problem)
  const flags: string[] = []
  if (answer.steps.length !== expectedSteps.length) flags.push("fusion_step_count_mismatch")
  let perfect = answer.steps.length === expectedSteps.length

  for (const [index, expectedStep] of expectedSteps.entries()) {
    const submitted = answer.steps[index]
    if (!submitted) {
      perfect = false
      continue
    }
    if (submitted.stepId !== expectedStep.id) {
      flags.push("fusion_step_id_mismatch")
      perfect = false
    }
    if (String(submitted.expected) !== String(expectedStep.expected)) {
      flags.push("fusion_expected_answer_mismatch")
      perfect = false
    }
    if (String(submitted.selected) !== String(expectedStep.expected)) perfect = false
  }

  return { perfect, flags }
}

const rewardMatches = (submitted: RewardEvent | undefined, expected: RewardEvent): boolean =>
  Boolean(submitted && submitted.id === expected.id && submitted.amount === expected.amount)

export const validateFusionSubmission = (input: LessonValidationInput): LessonValidationResult => {
  const structuralFlags = findStructuralFlags(input.answers, input.playTimeMs)
  if (structuralFlags.length > 0) return reject(structuralFlags)

  const problems = buildFusionProblems(input.seed)
  const flags: string[] = []
  let score = 0
  let correctCount = 0

  for (const answer of input.answers) {
    const problem = problems[answer.questionIndex]
    if (!problem) {
      flags.push("fusion_problem_index_mismatch")
      continue
    }
    const inspection = inspectFusionAnswer(answer, problem)
    flags.push(...inspection.flags)
    const expectedReward = inspection.perfect
      ? getFusionRewardForQuestion(input.seed, answer.questionIndex)
      : { id: "leak", amount: -100 }
    if (!rewardMatches(answer.reward, expectedReward)) flags.push("fusion_reward_seed_mismatch")
    if (!answer.reward || !rewardMatches(answer.reward, expectedReward)) continue
    if (inspection.perfect) correctCount += 1
    score = clamp(score + answer.reward.amount, 0, FUSION_MAX_SCORE)
  }

  if (flags.length > 0) return reject([...new Set(flags)])
  return {
    status: VALIDATION_STATUS.accepted,
    score: BigInt(score),
    correctCount,
    maxScore: BigInt(FUSION_MAX_SCORE),
    flagReasons: [],
  }
}
