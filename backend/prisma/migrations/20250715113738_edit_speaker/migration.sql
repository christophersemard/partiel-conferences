/*
  Warnings:

  - You are about to drop the column `speakerId` on the `Conference` table. All the data in the column will be lost.
  - Made the column `conferenceId` on table `Speaker` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Speaker" DROP CONSTRAINT "Speaker_conferenceId_fkey";

-- AlterTable
ALTER TABLE "Conference" DROP COLUMN "speakerId";

-- AlterTable
ALTER TABLE "Speaker" ALTER COLUMN "conferenceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
