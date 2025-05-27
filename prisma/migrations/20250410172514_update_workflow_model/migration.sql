-- AlterTable
ALTER TABLE "Worklflow" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "Worklflow" ADD COLUMN "lastRunId" TEXT;
ALTER TABLE "Worklflow" ADD COLUMN "lastRunStatus" TEXT;
