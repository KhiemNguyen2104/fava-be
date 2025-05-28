import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { AmadeusModule } from 'src/amadeus/amadeus.module';

@Module({
  providers: [WeatherService],
  controllers: [WeatherController],
  imports: [PrismaModule, AmadeusModule]
})
export class WeatherModule {}