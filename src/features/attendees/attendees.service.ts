import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Attendees, Prisma } from '@prisma/client';

import { CreateAttendeeDTO } from './dto/create-attendee.dto';
import { UpdateAttendeeDTO } from './dto/update-attendee.dto';
import { AttendeeForRecognition } from './types/attendee-for-recognition.types';
import { PaginatedResponse } from 'src/shared/types/paginated.response';
import { GetAllAttendeesDto } from './dto/get-all-attendees.dto';

@Injectable()
export class AttendeesService {
  constructor(private prisma: PrismaService) {}

  async createAttendee(payload: CreateAttendeeDTO): Promise<Attendees> {
    const attendee = await this.prisma.attendees.create({
      data: payload,
    })
    
    return attendee
  }

  async getAllAttendees(filters: GetAllAttendeesDto): Promise<PaginatedResponse<Attendees>>   {
    const { page = 1, limit = 10, organizationId, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.AttendeesWhereInput = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { primaryLeader: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const [total, attendees] = await this.prisma.$transaction([
      this.prisma.attendees.count({
        where,
      }),

      this.prisma.attendees.findMany({
        where,
        take: limit,
        skip: skip,
      })
    ])

    return {
      data: attendees,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getAllAttendeesForRecognition(organizationId: string): Promise<AttendeeForRecognition[]> {
    const attendeesFromDB = await this.prisma.$queryRaw<any[]>`
      SELECT id, "first_name", "last_name", embedding::text AS embedding 
      FROM "attendees"s
      WHERE "organization_id" = ${organizationId} AND embedding IS NOT NULL;
    `;

    const attendees: AttendeeForRecognition[] = attendeesFromDB.map(attendee => ({
      ...attendee,
      embedding: JSON.parse(attendee.embedding)
    }));

    return attendees
  }

  async getAttendeeById(id: string): Promise<Attendees> {
    const attendee = await this.prisma.attendees.findUnique({
      where: { id },
    })

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return attendee
  }

  async getAllAttendeesByOrganization(organizationId: string): Promise<Attendees[]> {
    const attendees = await this.prisma.attendees.findMany({
      where: { organizationId: organizationId }
    });

    return attendees
  }

  async updateAttendee(id: string, payload: UpdateAttendeeDTO): Promise<Attendees> {
    const updatedAttendee = await this.prisma.attendees.update({
      where: { id },
      data: payload,
    });

    return updatedAttendee
  }

  async deleteAttendee(id: string): Promise<Attendees> {
    const deletedAttendee = await this.prisma.attendees.delete({
      where: { id }
    })  

    return deletedAttendee
  }
}
