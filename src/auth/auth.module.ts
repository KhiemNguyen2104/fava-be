import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [PrismaModule, JwtModule.register({})]
})
export class AuthModule {}
