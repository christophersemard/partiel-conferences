/*
  Warnings:

  - You are about to drop the column `fullName` on the `Speaker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Speaker" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '';
