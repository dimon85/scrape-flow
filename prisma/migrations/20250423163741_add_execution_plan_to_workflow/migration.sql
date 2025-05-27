-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Worklflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" TEXT NOT NULL,
    "executionPlan" TEXT,
    "creditsCost" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "lastRunAt" DATETIME,
    "lastRunId" TEXT,
    "lastRunStatus" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Worklflow" ("createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt", "userId") SELECT "createdAt", "definition", "description", "id", "lastRunAt", "lastRunId", "lastRunStatus", "name", "status", "updatedAt", "userId" FROM "Worklflow";
DROP TABLE "Worklflow";
ALTER TABLE "new_Worklflow" RENAME TO "Worklflow";
CREATE UNIQUE INDEX "Worklflow_userId_name_key" ON "Worklflow"("userId", "name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
