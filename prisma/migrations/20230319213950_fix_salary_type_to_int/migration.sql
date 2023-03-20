/*
  Warnings:

  - You are about to alter the column `salary` on the `CandidateProfile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CandidateProfile" (
    "email" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CandidateProfile" ("description", "email", "position", "salary", "stack", "userId") SELECT "description", "email", "position", "salary", "stack", "userId" FROM "CandidateProfile";
DROP TABLE "CandidateProfile";
ALTER TABLE "new_CandidateProfile" RENAME TO "CandidateProfile";
CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON "CandidateProfile"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
