import { Module } from '@nestjs/common';
import { EventRegistrationsService } from './event-registrations.service';
import { EventRegistrationsController } from './event-registrations.controller';
import { PrismaService } from 'src/shared/database/prisma.service';

@Module({
  controllers: [EventRegistrationsController],
  providers: [EventRegistrationsService, PrismaService],
})
export class EventRegistrationsModule {}
