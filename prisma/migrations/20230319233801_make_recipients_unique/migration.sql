/*
  Warnings:

  - A unique constraint covering the columns `[recipients]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_recipients_key" ON "Room"("recipients");
