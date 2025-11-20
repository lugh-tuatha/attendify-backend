import { BadGatewayException, BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Attendance, MemberStatus, Prisma } from '@prisma/client';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { FaceRecognitionApiResponse } from './types/face-recognition-api.response';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';
import { getWeekNumber } from 'src/shared/utils/date.utils';
import { UNTRACKED_MEMBER_STATUSES } from 'src/core/attendees/constants/attendee.constant';
import { attendanceWithAttendeeStatusArgs, GetVipsResponse } from './types/get-vips.response';
import { AttendancePaginatedResponse } from './types/attendance-paginated.response';
import { ApiWithMetaResponse } from 'src/shared/types/api-with-meta.response';

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
    const { isLate, attendeeId, eventId, organizationId } = payload;

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const currentDate = new Date();
    const currentWeekNumber = getWeekNumber(currentDate);

    const occuranceDate = formatter.format(currentDate); 
    console.log(occuranceDate)

    const existingAttendance = await this.prisma.attendance.findFirst({
      where: {
        attendeeId: attendeeId,
        eventId: eventId,
        organizationId: organizationId,
        occuranceDate: occuranceDate
      }
    })

    if (existingAttendance) {
      throw new ConflictException(
        'Attendee has already checked in today.',
      );
    }

    const checkInPayload = {
      attendeeId: attendeeId,
      timeIn: currentDate,
      occuranceDate: occuranceDate,
      isLate: isLate,
      weekNumber: currentWeekNumber,
      eventId: eventId,
      organizationId: organizationId,
    }

    const attendance = await this.prisma.attendance.create({
      data: checkInPayload,
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

    if(!attendance.attendee || !attendance.attendee.memberStatus) {
      console.log('Skipping to update member status not found or null')
      return attendance
    }

    const currentMemberStatus = attendance.attendee.memberStatus;

    if (UNTRACKED_MEMBER_STATUSES.includes(currentMemberStatus)) {
      return attendance;
    }

    const newStatus = this.getNextMemberStatus(currentMemberStatus);

    await this.prisma.attendees.update({
      where: { id: attendance.attendee.id },
      data: { memberStatus: newStatus },
    })
    console.log(`Updated attendee ${attendance.attendee.id}, new status: ${newStatus}`);

    return attendance
  }

  async checkInByFace(payload: CheckInByFaceDto): Promise<CheckInByFaceResponse> {
    const { imageAsDataUrl, isLate, eventId, organizationId } = payload;
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
      const checkInPayload = {
        attendeeId: attendee_id,
        timeIn: new Date(),
        isLate: isLate,
        weekNumber: getWeekNumber(new Date()),
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
      if (error instanceof BadRequestException || 
          error instanceof ConflictException || 
          error instanceof NotFoundException) {
        throw error;
      }

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

  async getAllAttendance(filters: GetAllAttendanceDto): Promise<AttendancePaginatedResponse<Attendance>> {
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
      where.occuranceDate = date;
    }

    const [total, totalVips, attendance] = await this.prisma.$transaction([
      this.prisma.attendance.count({
        where,
      }),

      this.prisma.attendance.count({
        where: {
          ...where,
          attendee: { memberStatus: { in: ['FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER'] } }
        }
      }),

      this.prisma.attendance.findMany({ 
        where,
        include: {
          attendee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              primaryLeader: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              },
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
        orderBy: [
          { createdAt: 'desc' },
        ]
      })
    ])

    return {
      data: attendance,
      meta: {
        total,
        totalVips,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getVipAttendance(slug: string, date: string): Promise<GetVipsResponse> {
    const attendance = await this.prisma.attendance.findMany({
      where: { 
        event: { slug: slug }, 
        attendee: { 
          memberStatus: {
            in: ['FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER']
          } 
        },
        occuranceDate: date
      },
      ...attendanceWithAttendeeStatusArgs,
    })

    const groupedVips: GetVipsResponse = {
      FIRST_TIMER: [],
      SECOND_TIMER: [],
      THIRD_TIMER: [],
      FOURTH_TIMER: []
    };

    for (const record of attendance) {
      const status = record.attendee!.memberStatus

      if (status === 'FIRST_TIMER') {
        groupedVips.FIRST_TIMER.push(record);
      } else if (status === 'SECOND_TIMER') {
        groupedVips.SECOND_TIMER.push(record);
      } else if (status === 'THIRD_TIMER') {
        groupedVips.THIRD_TIMER.push(record);
      } else if (status === 'FOURTH_TIMER') {
        groupedVips.FOURTH_TIMER.push(record);
      }
    }

    return groupedVips;
  }

  async getAttendanceByEventId(eventId: string): Promise<ApiWithMetaResponse<Attendance>> {
    const [total, totalVips, attendance] = await this.prisma.$transaction([
      this.prisma.attendance.count({
        where: { eventId: eventId }
      }),

      this.prisma.attendance.count({
        where: { 
          eventId: eventId, 
          attendee: { 
            memberStatus: { in: ['FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'FOURTH_TIMER'] } 
          } 
        }
      }),

      this.prisma.attendance.findMany({
        where: { eventId: eventId },
        include: {
          attendee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              churchHierarchy: true,
              memberStatus: true,
              primaryLeader: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' },
        ]
      })
    ])
    console.log(total, totalVips)

    return {
      data: attendance,
      meta: {
        total,
        totalVips,
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


  private async verifyFaceWithApi(imageAsDataUrl: string): Promise<FaceRecognitionApiResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<FaceRecognitionApiResponse>(this.faceRecognitionApiUrl, { imageAsDataUrl })
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          throw new BadGatewayException(`Face recognition service failed: ${error.response.data}`);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          throw new BadGatewayException('Face recognition service is unreachable.');
        }
      }
      throw new InternalServerErrorException('Unexpected error occurred while verifying face.');
    }
  }

  private getNextMemberStatus(currentStatus: MemberStatus): MemberStatus {
    switch (currentStatus) {
      case null:
        return MemberStatus.FIRST_TIMER;
      case MemberStatus.NEWCOMER:
        return MemberStatus.FIRST_TIMER;
      case MemberStatus.FIRST_TIMER:
        return MemberStatus.SECOND_TIMER;
      case MemberStatus.SECOND_TIMER:
        return MemberStatus.THIRD_TIMER;
      case MemberStatus.THIRD_TIMER:
        return MemberStatus.FOURTH_TIMER;
      case MemberStatus.FOURTH_TIMER:
        return MemberStatus.REGULAR_ATTENDEE;
      default:
        return MemberStatus.REGULAR_ATTENDEE;
    }
  }
}