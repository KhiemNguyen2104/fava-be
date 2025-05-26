/*
  Warnings:

  - You are about to drop the column `currentLocations` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "currentLocations",
ADD COLUMN     "currentLocation" TEXT;
