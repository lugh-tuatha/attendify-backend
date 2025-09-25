import { Module } from '@nestjs/common';
import { AttendanceTypesService } from './attendance-types.service';
import { AttendanceTypesController } from './attendance-types.controller';
import { PrismaService } from 'src/shared/database/prisma.service';

@Module({
  controllers: [AttendanceTypesController],
  providers: [AttendanceTypesService, PrismaService],
})
export class AttendanceTypesModule {}
