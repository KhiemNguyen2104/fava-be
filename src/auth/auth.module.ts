import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { AmadeusModule } from 'src/amadeus/amadeus.module';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [PrismaModule, AmadeusModule, WeatherModule, JwtModule.register({})]
})
export class AuthModule {}
