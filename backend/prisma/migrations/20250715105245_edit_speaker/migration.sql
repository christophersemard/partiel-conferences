/*
  Warnings:

  - A unique constraint covering the columns `[conferenceId]` on the table `Speaker` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Conference" DROP CONSTRAINT "Conference_speakerId_fkey";

-- AlterTable
ALTER TABLE "Conference" ALTER COLUMN "speakerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN     "conferenceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Speaker_conferenceId_key" ON "Speaker"("conferenceId");

-- AddForeignKey
ALTER TABLE "Speaker" ADD CONSTRAINT "Speaker_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE SET NULL ON UPDATE CASCADE;
