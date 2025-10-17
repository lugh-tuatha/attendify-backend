import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { CreateAttendanceResponse } from './types/create-attendance.response';
import { GetAllAttendanceByOrgAndTypeResponse } from './types/get-all-attendance-by-org-and-type.response';
import { DeleteAttendanceResponse } from './types/delete-attendance.response';
import { UpdateAttendanceResponse } from './types/update-attendance.response';
import { GetAttendanceByIdResponse } from './types/get-attendance-by-id.response';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';

@Injectable()
export class AttendanceService {
  private readonly faceRecognitionApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private prisma: PrismaService
  ) {
    const apiUrl = this.configService.get<string>('FACE_RECOGNITION_API_URL');

    if (!apiUrl) {
      throw new Error('FACE_RECOGNITION_API_URL is not defined in the .env file!');
    }

    this.faceRecognitionApiUrl = apiUrl;
  }

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

  async checkInByFace(payload: CheckInByFaceDto): Promise<CheckInByFaceResponse> {
    const response = await firstValueFrom(
      this.httpService.post<CheckInByFaceResponse>(this.faceRecognitionApiUrl, payload)
    );

    return response.data
  }

  async getAttendanceById(id: string): Promise<GetAttendanceByIdResponse> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    })

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return {
      status: 200,
      message: 'Attendance found successfully.',
      data: attendance,
    }
  }

  async getAllAttendanceByOrganizationAndAttendanceType(organizationId: string, attendanceTypeId: string, memberStatus?: string, attendeeId?: string, date?: string): Promise<GetAllAttendanceByOrgAndTypeResponse> {
    try {
      const attendance = await this.prisma.attendance.findMany({
        where: {
          organizationId: organizationId,
          attendanceTypeId: attendanceTypeId,
          attendee: memberStatus ? { memberStatus } : undefined,
          attendeeId: attendeeId ? attendeeId : undefined,
          ...(date && {
            createdAt: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lte: new Date(`${date}T23:59:59.999Z`)
            }
          })
        },
        include: {
          attendee: {
            select: {
              firstName: true,
              lastName: true,
              department: true,
              cellLeader: true,
              memberStatus: true,
            }
          },
          eventRegistration: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              primaryLeader: true,
              churchHierarchy: true,
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

  async updateAttendance(id: string, payload: UpdateAttendanceDTO): Promise<UpdateAttendanceResponse> {
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
