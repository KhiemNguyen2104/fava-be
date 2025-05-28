-- CreateTable
CREATE TABLE "HasLocation" (
    "userEmail" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,

    CONSTRAINT "HasLocation_pkey" PRIMARY KEY ("userEmail","cityName")
);

-- AddForeignKey
ALTER TABLE "HasLocation" ADD CONSTRAINT "HasLocation_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("userEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasLocation" ADD CONSTRAINT "HasLocation_cityName_fkey" FOREIGN KEY ("cityName") REFERENCES "WeatherLocations"("cityName") ON DELETE RESTRICT ON UPDATE CASCADE;
