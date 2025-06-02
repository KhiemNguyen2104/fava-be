/*
  Warnings:

  - The primary key for the `Clothes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Clothes" DROP CONSTRAINT "Clothes_pkey",
ADD CONSTRAINT "Clothes_pkey" PRIMARY KEY ("id", "userEmail");
