import { z } from "zod"

export const LESSON_IDS = [
  "3-2-1-1-mathmon-box-run",
  "3-2-1-2-mathmon-rocket-charge",
  "3-2-1-3-mathmon-jump-islands",
  "3-2-1-4-mathmon-fusion",
  "3-2-3-1-mathmon-target-hit",
  "3-2-3-2-mathmon-compass-ring",
  "3-2-3-3-mathmon-double-bridge",
  "3-2-3-4-mathmon-circle-pattern",
  "3-2-4-1-mathmon-pizza-fraction",
  "3-2-4-2-mathmon-fraction-scoop",
  "3-2-4-3-mathmon-fraction-sorter",
  "3-2-4-4-mathmon-fraction-tug",
] as const

export const LessonIdSchema = z.enum(LESSON_IDS)
export type LessonId = z.infer<typeof LessonIdSchema>

export type Lesson = {
  readonly id: LessonId
  readonly title: string
  readonly active: boolean
}

export const LESSONS: readonly Lesson[] = [
  {
    id: "3-2-1-1-mathmon-box-run",
    title: "매스몬 상자런",
    active: true,
  },
  {
    id: "3-2-1-2-mathmon-rocket-charge",
    title: "매스몬 로켓발사 대작전",
    active: true,
  },
  {
    id: "3-2-1-3-mathmon-jump-islands",
    title: "매스몬 10배 점프섬",
    active: true,
  },
  {
    id: "3-2-1-4-mathmon-fusion",
    title: "매스몬 로봇 합체",
    active: true,
  },
  {
    id: "3-2-3-1-mathmon-target-hit",
    title: "매스몬 표적 맞히기",
    active: true,
  },
  {
    id: "3-2-3-2-mathmon-compass-ring",
    title: "매스몬 컴퍼스 마법진",
    active: true,
  },
  {
    id: "3-2-3-3-mathmon-double-bridge",
    title: "매스몬 두 배 다리",
    active: true,
  },
  {
    id: "3-2-3-4-mathmon-circle-pattern",
    title: "매스몬 원 무늬 디자이너",
    active: true,
  },
  {
    id: "3-2-4-1-mathmon-pizza-fraction",
    title: "매스몬 피자 분수 가게",
    active: true,
  },
  {
    id: "3-2-4-2-mathmon-fraction-scoop",
    title: "매스몬 분수만큼 담기",
    active: true,
  },
  {
    id: "3-2-4-3-mathmon-fraction-sorter",
    title: "매스몬 분수 분류 컨베이어",
    active: true,
  },
  {
    id: "3-2-4-4-mathmon-fraction-tug",
    title: "매스몬 분수 줄다리기",
    active: true,
  },
] as const

export const getLesson = (lessonId: LessonId): Lesson | null =>
  LESSONS.find((lesson) => lesson.id === lessonId) ?? null
