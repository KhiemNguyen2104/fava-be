/*
  Warnings:

  - You are about to drop the column `useFulSuggestion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clothes" ADD COLUMN     "purposes" "Purpose"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "useFulSuggestion",
ADD COLUMN     "usefulSuggestions" INTEGER NOT NULL DEFAULT 0;
