import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { EventRegistrations, Prisma } from '@prisma/client';

import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';

@Injectable()
export class EventRegistrationsService {
  constructor(private prisma: PrismaService) {}
  
  async registerAttendee(payload: CreateEventRegistrationDto): Promise<EventRegistrations> {
    try {
      const attendee = await this.prisma.eventRegistrations.create({
        data: payload,
      })
  
      return attendee
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'This attendee is already registered for this event.',
        );
      }
      throw error;
    }
  }

  async getAllRegisteredAttendees(): Promise<EventRegistrations[]> {
    const eventRegistrations = await this.prisma.eventRegistrations.findMany({
      include: {
        attendee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            primaryLeader: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        },
      },
    });

    return eventRegistrations
  }

  async getRegisteredAttendeesByEventId(eventId: string): Promise<EventRegistrations[]> {
    const eventRegistrations = await this.prisma.eventRegistrations.findMany({
      where: {
        eventId: eventId,
      },
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
        },
      },
    });

    return eventRegistrations
  }
}