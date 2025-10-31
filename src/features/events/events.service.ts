import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { EventCategory, Events, Prisma } from '@prisma/client';

import { CreateEventDTO } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(payload: CreateEventDTO): Promise<Events> {
    const event = await this.prisma.events.create({
      data: payload,
    })

    return event
  }

  async getAllEvents(): Promise<Events[]> {
    const events = await this.prisma.events.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return events
  }

  async getEventById(id: string): Promise<Events> {
    const event = await this.prisma.events.findUnique({
      where: {
        id: id,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event
  }

  async getAllEventsByCategory(category: EventCategory): Promise<Events[]> {
    const events = await this.prisma.events.findMany({
      where: {
        category: category,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          }
        }
      } 
    });

    return events
  }

  async getEventBySlug(slug: string): Promise<Events> {
    const event = await this.prisma.events.findUnique({
      where: {
        slug: slug,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          }
        }
      }, 
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event
  }

  async getEventAttendees(
    id: string,
    search?: string
  ) : Promise<(Prisma.EventRegistrationsGetPayload<{ include: { attendee: true } }> )[]> {

    const where: Prisma.EventRegistrationsWhereInput = {
      eventId: id
    }
    
    if (search) {
      where.attendee = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]
      }
    }
    
    const attendees = await this.prisma.eventRegistrations.findMany({
      where,
      include: {
        attendee: true
      }
    })

    return attendees;
  }
}