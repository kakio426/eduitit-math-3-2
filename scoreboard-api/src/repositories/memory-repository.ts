import type { SessionId } from "../domain/ids"
import type { PlaySession, ScoreboardRepository, ScoreSubmission } from "./scoreboard-repository"

type MutableMemoryStore = {
  sessions: Map<SessionId, PlaySession>
  submissions: Map<string, ScoreSubmission>
}

const sortLeaderboard = (submissions: readonly ScoreSubmission[]): readonly ScoreSubmission[] =>
  [...submissions]
    .filter((submission) => submission.hiddenAt === null && submission.status !== "rejected")
    .sort((left, right) => {
      if (left.score === right.score) return left.createdAt.getTime() - right.createdAt.getTime()
      return left.score > right.score ? -1 : 1
    })

export const createMemoryRepository = (): ScoreboardRepository => {
  const state: MutableMemoryStore = {
    sessions: new Map(),
    submissions: new Map(),
  }

  return {
    async createSession(record) {
      const session: PlaySession = {
        ...record,
        submittedAt: null,
        rerollCount: record.rerollCount ?? 0,
      }
      state.sessions.set(session.id, session)
      return session
    },

    async findSession(sessionId) {
      return state.sessions.get(sessionId) ?? null
    },

    async updateSessionNickname(record) {
      const current = state.sessions.get(record.sessionId)
      if (!current) throw new Error("session not found")
      const updated: PlaySession = {
        ...current,
        nickname: record.nickname,
        rerollCount: record.rerollCount,
      }
      state.sessions.set(record.sessionId, updated)
      return updated
    },

    async saveSubmission(record) {
      const session = state.sessions.get(record.sessionId)
      if (!session) throw new Error("session not found")
      if (session.submittedAt) throw new Error("session already submitted")

      const submission: ScoreSubmission = {
        ...record,
        hiddenAt: null,
      }
      state.submissions.set(submission.id, submission)
      state.sessions.set(record.sessionId, {
        ...session,
        submittedAt: record.createdAt,
      })
      return submission
    },

    async listWeeklyLeaderboard(query) {
      return sortLeaderboard(
        [...state.submissions.values()].filter(
          (submission) =>
            submission.lessonId === query.lessonId && submission.weekStart === query.weekStart,
        ),
      ).slice(0, query.limit)
    },

    async listParticipationLeaderboard(query) {
      return sortLeaderboard(
        [...state.submissions.values()].filter(
          (submission) =>
            submission.lessonId === query.lessonId &&
            submission.participationCodeHash === query.participationCodeHash,
        ),
      ).slice(0, query.limit)
    },
  }
}
