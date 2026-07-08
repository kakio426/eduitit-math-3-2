import { describe, expect, test } from "bun:test"

import { validateLessonSubmission } from "../src/validators/lesson-validators"
import type { AnswerLogItem } from "../src/validators/schemas"

const createRocketAnswer = (questionIndex: number, rewardAmount: number): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [
    { stepId: "ones", selected: 6, expected: 6, elapsedMs: 900 },
    { stepId: "tens", selected: 12, expected: 12, elapsedMs: 1100 },
    { stepId: "hundreds", selected: 15, expected: 15, elapsedMs: 1200 },
  ],
  reward: { id: "normal", amount: rewardAmount },
})

const createRocketLaunchAnswer = (questionIndex: number): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [
    { stepId: "ones", selected: 6, expected: 6, elapsedMs: 900 },
    { stepId: "tens", selected: 12, expected: 12, elapsedMs: 1100 },
    { stepId: "hundreds", selected: 15, expected: 15, elapsedMs: 1200 },
  ],
  reward: { id: "instantLaunch", amount: 6 },
})

const createBoxPerfectAnswer = (
  questionIndex: number,
  reward: { readonly id: string; readonly amount: number } = { id: "add_100", amount: 100 },
): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [{ stepId: "answer", selected: 246, expected: 246, elapsedMs: 900 }],
  reward,
})

const createBoxBrokenAnswer = (questionIndex: number, amount: number): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [{ stepId: "answer", selected: 245, expected: 246, elapsedMs: 900 }],
  reward: { id: "broken", amount },
})

const createFusionAnswer = (
  questionIndex: number,
  reward: { readonly id: string; readonly amount: number } = { id: "normal", amount: 100 },
): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 5200,
  steps: [
    { stepId: "partial1", selected: 46, expected: 46, elapsedMs: 900 },
    { stepId: "partial2", selected: 460, expected: 460, elapsedMs: 1100 },
    { stepId: "fusion", selected: 506, expected: 506, elapsedMs: 1200 },
  ],
  reward,
})

const createFractionAnswer = (
  questionIndex: number,
  stepId = "name",
  reward: { readonly id: string; readonly amount: number } = { id: "normal", amount: 6 },
): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [{ stepId, selected: "1/2", expected: "1/2", elapsedMs: 900 }],
  reward,
})

const createCircleAnswer = (
  questionIndex: number,
  stepId = "find",
  reward: { readonly id: string; readonly amount: number } = { id: "normal", amount: 6 },
): AnswerLogItem => ({
  questionIndex,
  elapsedMs: 4200,
  steps: [{ stepId, selected: "가", expected: "가", elapsedMs: 900 }],
  reward,
})

describe("lesson validators", () => {
  test("Given ten perfect rocket answers When validating Then score is computed on the server", () => {
    const answers = Array.from({ length: 10 }, (_value, index) => createRocketAnswer(index, 5))

    const result = validateLessonSubmission({
      lessonId: "3-2-1-2-mathmon-rocket-charge",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(50n)
    expect(result.correctCount).toBe(10)
    expect(result.maxScore).toBe(100n)
  })

  test("Given an impossible rocket reward When validating Then the result is rejected", () => {
    const answers = Array.from({ length: 10 }, (_value, index) => createRocketAnswer(index, 500))

    const result = validateLessonSubmission({
      lessonId: "3-2-1-2-mathmon-rocket-charge",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("rejected")
    expect(result.flagReasons).toContain("reward_amount_out_of_range")
  })

  test("Given rocket answers ending with instant launch When validating Then early finish is accepted", () => {
    const answers = [
      createRocketAnswer(0, 5),
      createRocketAnswer(1, 6),
      createRocketLaunchAnswer(2),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-1-2-mathmon-rocket-charge",
      seed: 12345,
      answers,
      playTimeMs: 18000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(17n)
    expect(result.correctCount).toBe(3)
  })

  test("Given a broken box reward with dynamic score loss When validating Then the server accepts the score", () => {
    const answers = [
      createBoxPerfectAnswer(0, { id: "add_100000", amount: 100000 }),
      createBoxBrokenAnswer(1, -100100),
      ...Array.from({ length: 8 }, (_value, index) => createBoxPerfectAnswer(index + 2)),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-1-1-mathmon-box-run",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(3800n)
    expect(result.correctCount).toBe(9)
  })

  test("Given fusion answers ending with completion signal before question ten When validating Then early finish is rejected", () => {
    const answers = [
      createFusionAnswer(0, { id: "normal", amount: 100 }),
      createFusionAnswer(1, { id: "instantLaunch", amount: 500 }),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-1-4-mathmon-fusion",
      seed: 12345,
      answers,
      playTimeMs: 12000,
    })

    expect(result.status).toBe("rejected")
    expect(result.flagReasons).toContain("answer_count_must_be_10")
  })

  test("Given fusion answers with additive rewards When validating Then score follows visible points", () => {
    const answers = [
      createFusionAnswer(0, { id: "normal", amount: 50 }),
      createFusionAnswer(1, { id: "normal", amount: 100 }),
      createFusionAnswer(2, { id: "megaFuel", amount: 200 }),
      createFusionAnswer(3, { id: "instantLaunch", amount: 500 }),
      createFusionAnswer(4, { id: "emptyTank", amount: 0 }),
      createFusionAnswer(5, { id: "rainbowFuel", amount: 800 }),
      {
        ...createFusionAnswer(6, { id: "leak", amount: -100 }),
        steps: [
          { stepId: "partial1", selected: 45, expected: 46, elapsedMs: 900 },
          { stepId: "partial2", selected: 460, expected: 460, elapsedMs: 1100 },
          { stepId: "fusion", selected: 506, expected: 506, elapsedMs: 1200 },
        ],
      },
      createFusionAnswer(7, { id: "smallExplosion", amount: -50 }),
      createFusionAnswer(8, { id: "normal", amount: 100 }),
      createFusionAnswer(9, { id: "instantLaunch", amount: 500 }),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-1-4-mathmon-fusion",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(2100n)
    expect(result.correctCount).toBe(9)
    expect(result.maxScore).toBe(8000n)
  })

  test("Given ten perfect fraction answers When validating Then score is computed on the server", () => {
    const answers = Array.from({ length: 10 }, (_value, index) => createFractionAnswer(index))

    const result = validateLessonSubmission({
      lessonId: "3-2-4-1-mathmon-pizza-fraction",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(60n)
    expect(result.correctCount).toBe(10)
    expect(result.maxScore).toBe(100n)
  })

  test("Given ten perfect circle answers When validating Then score is computed on the server", () => {
    const answers = Array.from({ length: 10 }, (_value, index) =>
      createCircleAnswer(index, "place"),
    )

    const result = validateLessonSubmission({
      lessonId: "3-2-3-4-mathmon-circle-pattern",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(60n)
    expect(result.correctCount).toBe(10)
    expect(result.maxScore).toBe(100n)
  })

  test("Given a fraction answer with impossible reward When validating Then the result is rejected", () => {
    const answers = Array.from({ length: 10 }, (_value, index) =>
      createFractionAnswer(index, "scoop", { id: "megaFuel", amount: 99 }),
    )

    const result = validateLessonSubmission({
      lessonId: "3-2-4-2-mathmon-fraction-scoop",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("rejected")
    expect(result.flagReasons).toContain("reward_amount_out_of_range")
  })

  test("Given fraction answers ending with instant win When validating Then early finish is accepted", () => {
    const answers = [
      createFractionAnswer(0, "sort", { id: "normal", amount: 5 }),
      createFractionAnswer(1, "sort", { id: "instantLaunch", amount: 6 }),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-4-3-mathmon-fraction-sorter",
      seed: 12345,
      answers,
      playTimeMs: 12000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(11n)
    expect(result.correctCount).toBe(2)
  })

  test("Given a leaked fraction tug answer When validating Then the server accepts the loss", () => {
    const answers = [
      createFractionAnswer(0, "compare", { id: "normal", amount: 8 }),
      {
        ...createFractionAnswer(1, "compare", { id: "leak", amount: -12 }),
        steps: [{ stepId: "compare", selected: "left", expected: "right", elapsedMs: 900 }],
      },
      ...Array.from({ length: 8 }, (_value, index) =>
        createFractionAnswer(index + 2, "compare", { id: "normal", amount: 4 }),
      ),
    ]

    const result = validateLessonSubmission({
      lessonId: "3-2-4-4-mathmon-fraction-tug",
      seed: 12345,
      answers,
      playTimeMs: 62000,
    })

    expect(result.status).toBe("accepted")
    expect(result.score).toBe(32n)
    expect(result.correctCount).toBe(9)
  })
})
