/*
  Warnings:

  - You are about to drop the `Worklflow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorklflowExecution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Worklflow_userId_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Worklflow";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorklflowExecution";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "executionPlan" TEXT,
    "creditsCost" INTEGER NOT NULL DEFAULT 0,
    "cron" TEXT,
    "status" TEXT NOT NULL,
    "lastRunAt" DATETIME,
    "lastRunId" TEXT,
    "lastRunStatus" TEXT,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "definition" TEXT NOT NULL DEFAULT '{}',
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExecutionPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "node" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "inputs" TEXT,
    "outputs" TEXT,
    "creditsConsumed" INTEGER,
    "workflowExecutionId" TEXT NOT NULL,
    CONSTRAINT "ExecutionPhase_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExecutionPhase" ("completedAt", "creditsConsumed", "id", "inputs", "name", "node", "number", "outputs", "startedAt", "status", "userId", "workflowExecutionId") SELECT "completedAt", "creditsConsumed", "id", "inputs", "name", "node", "number", "outputs", "startedAt", "status", "userId", "workflowExecutionId" FROM "ExecutionPhase";
DROP TABLE "ExecutionPhase";
ALTER TABLE "new_ExecutionPhase" RENAME TO "ExecutionPhase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_userId_name_key" ON "Workflow"("userId", "name");
