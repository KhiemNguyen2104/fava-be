import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [AuthModule, PrismaModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
