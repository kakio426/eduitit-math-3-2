import { createSessionId, createSubmissionId, type SessionId } from "../domain/ids"
import { getLesson, type LessonId } from "../domain/lessons"
import { createNicknameGenerator, isApprovedNickname } from "../domain/nickname"
import { hashParticipationCode, parseParticipationCode } from "../domain/participation-code"
import { addMinutes, getUtcWeekStart, toDateOnly } from "../domain/time"
import type { ScoreboardRepository, ScoreSubmission } from "../repositories/scoreboard-repository"
import { VALIDATION_STATUS, validateLessonSubmission } from "../validators/lesson-validators"
import type { AnswerLogItem } from "../validators/schemas"

const SESSION_TTL_MINUTES = 90
const MAX_NICKNAME_REROLLS = 5

type RandomSource = () => number
type Clock = () => Date

export type ScoreboardServiceDeps = {
  readonly repository: ScoreboardRepository
  readonly now: Clock
  readonly random: RandomSource
}

export type CreateSessionInput = {
  readonly lessonId: LessonId
  readonly participationCode?: string
}

export type SubmitScoreInput = {
  readonly sessionId: SessionId
  readonly lessonId: LessonId
  readonly nickname: string
  readonly participationCode?: string
  readonly clientScore: string
  readonly clientCorrectCount: number
  readonly playTimeMs: number
  readonly answers: readonly AnswerLogItem[]
  readonly rewardResult: unknown
}

export class ScoreboardService {
  readonly #repository: ScoreboardRepository
  readonly #now: Clock
  readonly #random: RandomSource
  readonly #generateNickname: () => string

  constructor(deps: ScoreboardServiceDeps) {
    this.#repository = deps.repository
    this.#now = deps.now
    this.#random = deps.random
    this.#generateNickname = createNicknameGenerator(deps.random)
  }

  async createSession(input: CreateSessionInput) {
    const lesson = getLesson(input.lessonId)
    if (!lesson?.active) throw new RequestError("lesson_not_found", 404)

    const now = this.#now()
    const participationCodeHash = input.participationCode
      ? hashParticipationCode(parseParticipationCode(input.participationCode))
      : null

    return this.#repository.createSession({
      id: createSessionId(),
      lessonId: input.lessonId,
      seed: this.#createSeed(),
      nickname: this.#generateNickname(),
      participationCodeHash,
      startedAt: now,
      expiresAt: addMinutes(now, SESSION_TTL_MINUTES),
    })
  }

  async rerollNickname(sessionId: SessionId) {
    const session = await this.#repository.findSession(sessionId)
    if (!session) throw new RequestError("session_not_found", 404)
    if (session.submittedAt) throw new RequestError("session_already_submitted", 409)
    if (session.rerollCount >= MAX_NICKNAME_REROLLS) {
      throw new RequestError("nickname_reroll_limit_reached", 429)
    }

    return this.#repository.updateSessionNickname({
      sessionId,
      nickname: this.#generateNickname(),
      rerollCount: session.rerollCount + 1,
    })
  }

  async submitScore(input: SubmitScoreInput): Promise<ScoreSubmission> {
    const session = await this.#repository.findSession(input.sessionId)
    if (!session) throw new RequestError("session_not_found", 404)
    if (session.submittedAt) throw new RequestError("session_already_submitted", 409)
    if (session.lessonId !== input.lessonId) throw new RequestError("lesson_mismatch", 400)
    if (session.nickname !== input.nickname || !isApprovedNickname(input.nickname)) {
      throw new RequestError("nickname_not_server_approved", 400)
    }

    const participationCodeHash = input.participationCode
      ? hashParticipationCode(parseParticipationCode(input.participationCode))
      : null
    if (participationCodeHash !== session.participationCodeHash) {
      throw new RequestError("participation_code_mismatch", 400)
    }

    const validation = validateLessonSubmission({
      lessonId: input.lessonId,
      seed: session.seed,
      answers: input.answers,
      playTimeMs: input.playTimeMs,
    })
    if (validation.status === VALIDATION_STATUS.rejected) {
      throw new RequestError("score_rejected", 422, validation.flagReasons)
    }

    const clientFlags = this.#findClientMismatchFlags(
      input,
      validation.score,
      validation.correctCount,
    )
    const flagReasons = [...validation.flagReasons, ...clientFlags]
    const status = flagReasons.length > 0 ? VALIDATION_STATUS.flagged : validation.status
    const now = this.#now()

    return this.#repository.saveSubmission({
      id: createSubmissionId(),
      sessionId: input.sessionId,
      lessonId: input.lessonId,
      nickname: input.nickname,
      participationCodeHash,
      score: validation.score,
      correctCount: validation.correctCount,
      maxScore: validation.maxScore,
      playTimeMs: input.playTimeMs,
      rewardResultJson: JSON.stringify(input.rewardResult ?? null),
      status,
      flagReasons,
      answers: input.answers,
      createdAt: now,
      weekStart: toDateOnly(getUtcWeekStart(now)),
    })
  }

  async weeklyLeaderboard(input: { readonly lessonId: LessonId; readonly limit: number }) {
    return this.#repository.listWeeklyLeaderboard({
      lessonId: input.lessonId,
      weekStart: toDateOnly(getUtcWeekStart(this.#now())),
      limit: input.limit,
    })
  }

  async participationLeaderboard(input: {
    readonly lessonId: LessonId
    readonly participationCode: string
    readonly limit: number
  }) {
    return this.#repository.listParticipationLeaderboard({
      lessonId: input.lessonId,
      participationCodeHash: hashParticipationCode(parseParticipationCode(input.participationCode)),
      limit: input.limit,
    })
  }

  #createSeed(): number {
    return Math.floor(this.#random() * 2_147_483_646) + 1
  }

  #findClientMismatchFlags(
    input: SubmitScoreInput,
    serverScore: bigint,
    serverCorrectCount: number,
  ): readonly string[] {
    const flags: string[] = []
    if (input.clientScore !== serverScore.toString()) flags.push("client_score_mismatch")
    if (input.clientCorrectCount !== serverCorrectCount) flags.push("client_correct_count_mismatch")
    return flags
  }
}

export class RequestError extends Error {
  readonly name = "RequestError"
  readonly code: string
  readonly status: number
  readonly details: readonly string[]

  constructor(code: string, status: number, details: readonly string[] = []) {
    super(code)
    this.code = code
    this.status = status
    this.details = details
  }
}
