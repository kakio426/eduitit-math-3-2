import type { PrismaClient } from "@prisma/client"

import { SessionIdSchema, SubmissionIdSchema } from "../domain/ids"
import { LessonIdSchema } from "../domain/lessons"
import type {
  CreateSessionRecord,
  PlaySession,
  SaveSubmissionRecord,
  ScoreboardRepository,
  ScoreSubmission,
} from "./scoreboard-repository"

const isAnswerCorrect = (record: SaveSubmissionRecord["answers"][number]): boolean =>
  record.steps.every((step) => String(step.selected) === String(step.expected))

const toSession = (record: {
  readonly id: string
  readonly lessonId: string
  readonly seed: number
  readonly nickname: string
  readonly participationCodeHash: string | null
  readonly startedAt: Date
  readonly expiresAt: Date
  readonly submittedAt: Date | null
  readonly rerollCount: number
}): PlaySession => ({
  id: SessionIdSchema.parse(record.id),
  lessonId: LessonIdSchema.parse(record.lessonId),
  seed: record.seed,
  nickname: record.nickname,
  participationCodeHash: record.participationCodeHash,
  startedAt: record.startedAt,
  expiresAt: record.expiresAt,
  submittedAt: record.submittedAt,
  rerollCount: record.rerollCount,
})

const toSubmission = (record: {
  readonly id: string
  readonly sessionId: string
  readonly lessonId: string
  readonly nickname: string
  readonly participationCodeHash: string | null
  readonly score: bigint
  readonly correctCount: number
  readonly maxScore: bigint
  readonly playTimeMs: number
  readonly rewardResultJson: string
  readonly status: "accepted" | "flagged" | "rejected"
  readonly flagReasons: readonly string[]
  readonly createdAt: Date
  readonly weekStart: string
  readonly hiddenAt: Date | null
}): ScoreSubmission => ({
  id: SubmissionIdSchema.parse(record.id),
  sessionId: SessionIdSchema.parse(record.sessionId),
  lessonId: LessonIdSchema.parse(record.lessonId),
  nickname: record.nickname,
  participationCodeHash: record.participationCodeHash,
  score: record.score,
  correctCount: record.correctCount,
  maxScore: record.maxScore,
  playTimeMs: record.playTimeMs,
  rewardResultJson: record.rewardResultJson,
  status: record.status,
  flagReasons: record.flagReasons,
  answers: [],
  createdAt: record.createdAt,
  weekStart: record.weekStart,
  hiddenAt: record.hiddenAt,
})

export const createPrismaRepository = (prisma: PrismaClient): ScoreboardRepository => ({
  async createSession(record: CreateSessionRecord) {
    const session = await prisma.playSession.create({
      data: {
        id: record.id,
        lessonId: record.lessonId,
        seed: record.seed,
        nickname: record.nickname,
        participationCodeHash: record.participationCodeHash,
        startedAt: record.startedAt,
        expiresAt: record.expiresAt,
        rerollCount: record.rerollCount ?? 0,
      },
    })
    return toSession(session)
  },

  async findSession(sessionId) {
    const session = await prisma.playSession.findUnique({ where: { id: sessionId } })
    return session ? toSession(session) : null
  },

  async updateSessionNickname(record) {
    const session = await prisma.playSession.update({
      where: { id: record.sessionId },
      data: {
        nickname: record.nickname,
        rerollCount: record.rerollCount,
      },
    })
    return toSession(session)
  },

  async saveSubmission(record) {
    await prisma.$transaction(async (tx) => {
      await tx.scoreSubmission.create({
        data: {
          id: record.id,
          sessionId: record.sessionId,
          lessonId: record.lessonId,
          nickname: record.nickname,
          participationCodeHash: record.participationCodeHash,
          score: record.score,
          correctCount: record.correctCount,
          maxScore: record.maxScore,
          playTimeMs: record.playTimeMs,
          rewardResultJson: record.rewardResultJson,
          status: record.status,
          flagReasons: [...record.flagReasons],
          createdAt: record.createdAt,
          weekStart: record.weekStart,
          answers: {
            create: record.answers.map((answer) => ({
              questionIndex: answer.questionIndex,
              elapsedMs: answer.elapsedMs,
              isCorrect: isAnswerCorrect(answer),
              answerPayloadJson: JSON.stringify(answer),
            })),
          },
        },
      })
      await tx.playSession.update({
        where: { id: record.sessionId },
        data: { submittedAt: record.createdAt },
      })
    })

    return {
      ...record,
      hiddenAt: null,
    }
  },

  async listWeeklyLeaderboard(query) {
    const submissions = await prisma.scoreSubmission.findMany({
      where: {
        lessonId: query.lessonId,
        weekStart: query.weekStart,
        hiddenAt: null,
        status: { not: "rejected" },
      },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: query.limit,
    })
    return submissions.map(toSubmission)
  },

  async listParticipationLeaderboard(query) {
    const submissions = await prisma.scoreSubmission.findMany({
      where: {
        lessonId: query.lessonId,
        participationCodeHash: query.participationCodeHash,
        hiddenAt: null,
        status: { not: "rejected" },
      },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: query.limit,
    })
    return submissions.map(toSubmission)
  },
})
