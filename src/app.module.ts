import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { WeatherModule } from './weather/weather.module';
import { UserModule } from './user/user.module';
import { ClothesModule } from './clothes/clothes.module';
import { VisionModule } from './vision/vision.module';
import { AmadeusModule } from './amadeus/amadeus.module';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [AuthModule, PrismaModule, WeatherModule, UserModule, ClothesModule, VisionModule, AmadeusModule, AssistantModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, ],
})
export class AppModule {}
