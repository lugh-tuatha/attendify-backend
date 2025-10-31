import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Attendance, Prisma } from '@prisma/client';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { PaginatedResponse } from 'src/shared/types/paginated.response';
import { FaceRecognitionApiResponse } from './types/face-recognition-api.response';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';
import { getWeekNumber } from 'src/shared/utils/date.utils';

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

  async createAttendance(payload: CreateAttendanceDTO): Promise<Attendance> {
    const attendance = await this.prisma.attendance.create({
      data: payload,
      include: {
        attendee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cellLeader: true,
            memberStatus: true,
          },
        },
        eventRegistration: true
      }
    })

    return attendance
  }

  private async verifyFaceWithApi(imageAsDataUrl: string): Promise<FaceRecognitionApiResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<FaceRecognitionApiResponse>(this.faceRecognitionApiUrl, { imageAsDataUrl })
      );

      return response.data;
    } catch (error) {
      console.error('Error calling face recognition API:', error);
      if (error instanceof AxiosError && error.response) {
        throw new BadGatewayException('Face recognition service failed', error.response.data);
      }
      throw new InternalServerErrorException('Face recognition service is unreachable.');
    }
  }

  async checkInByFace(payload: CheckInByFaceDto): Promise<CheckInByFaceResponse> {
    const { imageAsDataUrl, eventId, organizationId } = payload;
    let recognitionResponse = await this.verifyFaceWithApi(imageAsDataUrl);

    if (!recognitionResponse.verified) {
      console.warn('No face detected or not recognized');
      return {
        message: 'not-recognized',
        recognitionData: recognitionResponse,
      };
    }

    const { attendee_id } = recognitionResponse;
    if (!attendee_id) {
      console.error('Cannot check in: attendee_id is null after verification.');
      throw new InternalServerErrorException('Face recognized but attendee ID was missing.');
    }

    try {
      const now = new Date();

      const checkInPayload = {
        attendeeId: attendee_id,
        timeIn: now,
        weekNumber: getWeekNumber(now),
        eventId: eventId,
        organizationId: organizationId,
      };

      const newAttendance = await this.createAttendance(checkInPayload);

      return {
        message: 'checked-in',
        attendanceRecord: newAttendance,
        recognitionData: recognitionResponse,
      };
      
    } catch (error) {
      console.error('Database error during attendance processing:', error);
      throw new InternalServerErrorException('Failed to save attendance record.');
    }
  }
  
  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    })

    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    return attendance
  }

  async getAllAttendance(filters: GetAllAttendanceDto): Promise<PaginatedResponse<Attendance>> {
    const { page = 1, limit = 10, organizationId, search, slug, eventId, memberStatus, attendeeId, date } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceWhereInput = {}

    if (search) {
      where.attendee = { 
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (slug) {
      where.event = { slug: slug };
    }

    if (eventId) {
      where.eventId = eventId;
    }

    if (memberStatus) {
      where.attendee = { memberStatus };
    }

    if (attendeeId) {
      where.attendeeId = attendeeId;
    }

    if (date) {
      where.timeIn = {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`),
      };
    }

    const [total, attendance] = await this.prisma.$transaction([
      this.prisma.attendance.count({
        where,
      }),

      this.prisma.attendance.findMany({ 
        where,
        include: {
          attendee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              primaryLeader: true,
              churchProcess: true,
              memberStatus: true,
            },
          },
          event: {
            select: {
              slug: true,
            }
          },
          eventRegistration: true
        },
        take: limit,
        skip: skip,
      })
    ])

    return {
      data: attendance,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async updateAttendance(id: string, payload: UpdateAttendanceDTO): Promise<Attendance> {
    const updateAttendance = await this.prisma.attendance.update({
      where: { id },
      data: payload,
    });

    return updateAttendance
  }   

  async deleteAttendance(id: string): Promise<Attendance> {
    const deletedAttendance = await this.prisma.attendance.delete({
      where: { id }
    })  

    return deletedAttendance;
  }
}