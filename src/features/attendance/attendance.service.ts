import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceResponse } from './types/create-attendance.response';
import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { GetAllAttendanceByOrganizationAndAttendanceTypeResponse } from './types/get-all-attendance-by-organization-and-attendance-type.response';
import { DeleteAttendanceResponse } from './types/delete-attendance.response';
import { updateAttendanceDTO } from './dto/update-attendance.dto';
import { UpdateAttendanceResponse } from './types/update-attendance.response';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async createAttendance(payload: CreateAttendanceDTO): Promise<CreateAttendanceResponse> {
    try {
      const event = await this.prisma.attendance.create({
        data: payload,
      })

      return {
        status: 201,
        message: 'Attendance created successfully.',
        data: event,
      }
    } catch (error) {
      console.error('Error creating attendee:', error);
      throw new InternalServerErrorException('Failed to create attendee');
    }
  }

  async getAllAttendanceByOrganizationAndAttendanceType(organizationId: string, attendanceTypeId: string, weekNumber: number, memberStatus?: string): Promise<GetAllAttendanceByOrganizationAndAttendanceTypeResponse> {
    try {
      const attendance = await this.prisma.attendance.findMany({
        where: {
          organizationId: organizationId,
          attendanceTypeId: attendanceTypeId,
          weekNumber: weekNumber,
          attendee: memberStatus ? { memberStatus } : undefined
        },
        include: {
          attendee: {
            select: {
              firstName: true,
              lastName: true,
              cellLeader: true,
              memberStatus: true,
            }
          }
        }
      });

      return {
        status: 200,
        message: 'Attendance fetched successfully.',
        results: attendance.length,
        data: attendance,
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw new InternalServerErrorException('Failed to fetch attendance');
    }
  }

  async updateAttendance(id: string, payload: updateAttendanceDTO): Promise<UpdateAttendanceResponse> {
    try {
      const updateAttendance = await this.prisma.attendance.update({
        where: { id },
        data: payload,
      });

      return {
        status: 200,
        message: 'Attendee updated successfully',
        data: updateAttendance,
      };
    } catch (error) {
      console.error('Error updating attendee:', error);
      throw new InternalServerErrorException('Failed to update atttendance');
    }
  }

  async deleteAttendance(id: string): Promise<DeleteAttendanceResponse> {
    try {
      await this.prisma.attendance.delete({
        where: { id }
      })  

      return {
        success: true,
        message: 'Attendance deleted successfully.',
        deletedId: id,
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete attendee');
    }
  }
}
