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
})
