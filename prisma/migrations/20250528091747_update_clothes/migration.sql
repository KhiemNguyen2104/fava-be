/*
  Warnings:

  - Added the required column `quant` to the `Clothes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clothes" ADD COLUMN     "quant" INTEGER NOT NULL;
