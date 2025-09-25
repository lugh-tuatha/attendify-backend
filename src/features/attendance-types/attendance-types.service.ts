import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { CreateAttendanceTypeDTO } from './dto/create-attendance-type.dto';

import { CreateAttendanceTypeResponse } from './types/create-attendance-type.response';
import { GetAllAttendanceTypesResponse } from './types/get-all-attendance-types.response';

@Injectable()
export class AttendanceTypesService {
  constructor(private prisma: PrismaService) {}

  async createAttendanceType(payload: CreateAttendanceTypeDTO): Promise<CreateAttendanceTypeResponse> {
    try {
      const attendanceType = await this.prisma.attendanceTypes.create({
        data: payload,
      })

      return {
        status: 201,
        message: 'Attendance type created successfully.',
        data: attendanceType,
      }
    } catch (error) {
      console.error('Error creating attendee:', error);
      throw new InternalServerErrorException('Failed to create attendee');
    }
  }

  async getAllEvents(): Promise<GetAllAttendanceTypesResponse> {
    try {
      const events = await this.prisma.attendanceTypes.findMany();

      return {
        status: 200,
        results: events.length,
        data: events,
      }
    } catch (error) {
      console.error('Error fetching attendance types:', error);
      throw new InternalServerErrorException('Failed to fetch attendance types');
    }
  }
}
