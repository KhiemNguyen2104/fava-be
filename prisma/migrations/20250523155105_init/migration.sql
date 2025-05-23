-- CreateEnum
CREATE TYPE "Size" AS ENUM ('S', 'M', 'L', 'X', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "ClothesKind" AS ENUM ('Coat', 'TShirt', 'Skirt', 'Shirt', 'Pants', 'Hat');

-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('Work', 'GoOut', 'Party');

-- CreateTable
CREATE TABLE "User" (
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "hashKey" TEXT NOT NULL,
    "suggestions" INTEGER NOT NULL DEFAULT 0,
    "useFulSuggestion" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userEmail")
);

-- CreateTable
CREATE TABLE "Clothes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ClothesKind" NOT NULL,
    "tempFloor" DOUBLE PRECISION NOT NULL,
    "tempRoof" DOUBLE PRECISION NOT NULL,
    "label" TEXT,
    "size" "Size",
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Clothes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherLocations" (
    "cityName" TEXT NOT NULL,

    CONSTRAINT "WeatherLocations_pkey" PRIMARY KEY ("cityName")
);

-- AddForeignKey
ALTER TABLE "Clothes" ADD CONSTRAINT "Clothes_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("userEmail") ON DELETE RESTRICT ON UPDATE CASCADE;
