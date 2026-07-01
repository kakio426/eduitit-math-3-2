import { z } from "zod"

export const LESSON_IDS = [
  "3-2-1-1-mathmon-box-run",
  "3-2-1-2-mathmon-rocket-charge",
  "3-2-1-3-mathmon-jump-islands",
  "3-2-1-4-mathmon-fusion",
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
] as const

export const getLesson = (lessonId: LessonId): Lesson | null =>
  LESSONS.find((lesson) => lesson.id === lessonId) ?? null
