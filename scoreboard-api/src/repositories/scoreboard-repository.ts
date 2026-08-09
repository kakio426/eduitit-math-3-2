import type { SessionId, SubmissionId } from "../domain/ids"
import type { LessonId } from "../domain/lessons"
import type { ValidationStatus } from "../validators/lesson-validators"
import type { AnswerLogItem } from "../validators/schemas"

export type PlaySession = {
  readonly id: SessionId
  readonly lessonId: LessonId
  readonly seed: number
  readonly nickname: string
  readonly participationCodeHash: string | null
  readonly startedAt: Date
  readonly expiresAt: Date
  readonly submittedAt: Date | null
  readonly rerollCount: number
}

export type ScoreSubmission = {
  readonly id: SubmissionId
  readonly sessionId: SessionId
  readonly lessonId: LessonId
  readonly nickname: string
  readonly participationCodeHash: string | null
  readonly score: bigint
  readonly correctCount: number
  readonly maxScore: bigint
  readonly playTimeMs: number
  readonly rewardResultJson: string
  readonly status: ValidationStatus
  readonly flagReasons: readonly string[]
  readonly answers: readonly AnswerLogItem[]
  readonly createdAt: Date
  readonly weekStart: string
  readonly hiddenAt: Date | null
}

export type CreateSessionRecord = Omit<PlaySession, "submittedAt" | "rerollCount"> & {
  readonly rerollCount?: number
}

export type SaveSubmissionRecord = Omit<ScoreSubmission, "hiddenAt">

export interface ScoreboardRepository {
  createSession(record: CreateSessionRecord): Promise<PlaySession>
  findSession(sessionId: SessionId): Promise<PlaySession | null>
  updateSessionNickname(record: {
    readonly sessionId: SessionId
    readonly nickname: string
    readonly rerollCount: number
  }): Promise<PlaySession>
  saveSubmission(record: SaveSubmissionRecord): Promise<ScoreSubmission>
  listWeeklyLeaderboard(query: {
    readonly lessonId: LessonId
    readonly weekStart: string
    readonly limit: number
  }): Promise<readonly ScoreSubmission[]>
  listParticipationLeaderboard(query: {
    readonly lessonId: LessonId
    readonly participationCodeHash: string
    readonly limit: number
  }): Promise<readonly ScoreSubmission[]>
}
