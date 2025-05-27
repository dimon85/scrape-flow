-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorklflowExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WorklflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Worklflow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorklflowExecution" ("completedAt", "createdAt", "id", "startedAt", "status", "trigger", "userId", "workflowId") SELECT "completedAt", "createdAt", "id", "startedAt", "status", "trigger", "userId", "workflowId" FROM "WorklflowExecution";
DROP TABLE "WorklflowExecution";
ALTER TABLE "new_WorklflowExecution" RENAME TO "WorklflowExecution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
