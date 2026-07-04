import type { AnswerLogItem } from "../src/validators/schemas"

export const createRocketAnswers = (): readonly AnswerLogItem[] =>
  Array.from({ length: 10 }, (_value, index) => ({
    questionIndex: index,
    elapsedMs: 4200,
    steps: [
      { stepId: "ones", selected: 6, expected: 6, elapsedMs: 900 },
      { stepId: "tens", selected: 12, expected: 12, elapsedMs: 1100 },
      { stepId: "hundreds", selected: 15, expected: 15, elapsedMs: 1200 },
    ],
    reward: { id: "normal", amount: 5 },
  }))

export const createFractionScoopAnswers = (): readonly AnswerLogItem[] =>
  Array.from({ length: 10 }, (_value, index) => ({
    questionIndex: index,
    elapsedMs: 4200,
    steps: [
      { stepId: "group", selected: 3, expected: 3, elapsedMs: 900 },
      { stepId: "scoop", selected: 9, expected: 9, elapsedMs: 1100 },
    ],
    reward: { id: "normal", amount: 6 },
  }))

export const createCirclePatternAnswers = (): readonly AnswerLogItem[] =>
  Array.from({ length: 10 }, (_value, index) => ({
    questionIndex: index,
    elapsedMs: 4200,
    steps: [{ stepId: "place", selected: "다", expected: "다", elapsedMs: 900 }],
    reward: { id: "normal", amount: 6 },
  }))
