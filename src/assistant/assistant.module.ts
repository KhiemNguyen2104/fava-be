import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AssistantService],
  controllers: [AssistantController],
  imports: [PrismaModule]
})
export class AssistantModule {}
