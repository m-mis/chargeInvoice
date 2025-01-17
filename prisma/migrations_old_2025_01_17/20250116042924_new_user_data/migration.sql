-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstDownloadCompletedAt" TIMESTAMP(3),
ADD COLUMN     "termsAndConditionsAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "termsAndConditionsVersion" TEXT;
