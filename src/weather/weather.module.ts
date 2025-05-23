import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [WeatherService],
  controllers: [WeatherController],
  imports: [PrismaModule]
})
export class WeatherModule {}