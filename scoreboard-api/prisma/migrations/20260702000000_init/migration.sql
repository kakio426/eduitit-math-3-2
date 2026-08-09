CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "SubmissionStatus" AS ENUM ('accepted', 'flagged', 'rejected');

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlaySession" (
    "id" UUID NOT NULL,
    "lessonId" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "participationCodeHash" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "rerollCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlaySession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ScoreSubmission" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "lessonId" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "participationCodeHash" TEXT,
    "score" BIGINT NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "maxScore" BIGINT NOT NULL,
    "playTimeMs" INTEGER NOT NULL,
    "rewardResultJson" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "flagReasons" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL,
    "weekStart" TEXT NOT NULL,
    "hiddenAt" TIMESTAMP(3),

    CONSTRAINT "ScoreSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnswerLog" (
    "id" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "elapsedMs" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answerPayloadJson" TEXT NOT NULL,

    CONSTRAINT "AnswerLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminAuditLog" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PlaySession_lessonId_startedAt_idx" ON "PlaySession"("lessonId", "startedAt");

CREATE INDEX "PlaySession_participationCodeHash_idx" ON "PlaySession"("participationCodeHash");

CREATE UNIQUE INDEX "ScoreSubmission_sessionId_key" ON "ScoreSubmission"("sessionId");

CREATE INDEX "ScoreSubmission_lessonId_weekStart_score_idx" ON "ScoreSubmission"("lessonId", "weekStart", "score");

CREATE INDEX "ScoreSubmission_lessonId_participationCodeHash_score_idx" ON "ScoreSubmission"("lessonId", "participationCodeHash", "score");

CREATE INDEX "ScoreSubmission_status_idx" ON "ScoreSubmission"("status");

CREATE INDEX "AnswerLog_submissionId_idx" ON "AnswerLog"("submissionId");

ALTER TABLE "ScoreSubmission" ADD CONSTRAINT "ScoreSubmission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PlaySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AnswerLog" ADD CONSTRAINT "AnswerLog_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ScoreSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
