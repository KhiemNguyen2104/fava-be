import { Module } from '@nestjs/common';
import { ClothesService } from './clothes.service';
import { ClothesController } from './clothes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Inferring } from './inferring';

@Module({
  providers: [ClothesService, Inferring],
  controllers: [ClothesController],
  imports: [PrismaModule]
})
export class ClothesModule {}
