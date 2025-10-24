import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { CheckInByFaceResponse } from './types/check-in-by-face.response';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { Attendance, Prisma } from '@prisma/client';
import { AxiosError } from 'axios';

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

  async checkInByFace(payload: CheckInByFaceDto): Promise<CheckInByFaceResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<CheckInByFaceResponse>(this.faceRecognitionApiUrl, payload)
      );

      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('Fa ce recognition API error:', error.response.data);
          throw new BadGatewayException(
            'Face recognition service failed',
            error.response.data
          );
        }

        throw new BadGatewayException('Face recognition service is unreachable');
      }

      console.error('Unknown error during face check-in:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
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

  async getAllAttendance(filters: GetAllAttendanceDto): Promise<Attendance[]> {
    const { organizationId, search, eventId, memberStatus, attendeeId, date } = filters;

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
      where.createdAt = {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`),
      };
    }

    const attendees = this.prisma.attendance.findMany({ 
      where,
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
      },
    })

    return attendees;
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