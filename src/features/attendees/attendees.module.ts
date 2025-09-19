import { Module } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { PrismaService } from 'src/shared/database/prisma.service';
import { AttendeesController } from './attendees.controller';

@Module({
  controllers: [AttendeesController],
  providers: [AttendeesService, PrismaService],
})
export class AttendeesModule {}
