/*
  Warnings:

  - Changed the type of `sessionId` on the `ChargingSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChargingSession" DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" INTEGER NOT NULL;
