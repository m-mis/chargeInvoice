/*
  Warnings:

  - A unique constraint covering the columns `[teslaAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teslaAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_teslaAccountId_key" ON "User"("teslaAccountId");
