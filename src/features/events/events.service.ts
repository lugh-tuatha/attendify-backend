import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { CreateEventDTO } from './dto/create-event.dto';
import { CreateEventResponse } from './types/create-event.response';
import { GetAllEventResponse } from './types/get-all-events.response';
import { GetEventByIdResponse } from './types/get-event-by-id.response';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(payload: CreateEventDTO): Promise<CreateEventResponse> {
    try {
      const event = await this.prisma.events.create({
        data: payload,
      })

      return {
        status: 201,
        message: 'Event created successfully.',
        data: event,
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async getAllEvents(): Promise<GetAllEventResponse> {
    try {
      const events = await this.prisma.events.findMany({
        include: {
          organization: {
            select: {
              name: true,
            }
          }
        }
      });

      return {
        status: 200,
        message: 'Events fetched successfully.',
        results: events.length,
        data: events,
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new InternalServerErrorException('Failed to fetch events');
    }
  }

  async getEventById(id: string): Promise<GetEventByIdResponse> {
    try {
      const event = await this.prisma.events.findUnique({
        where: {
          id: id,
        },
        include: {
          organization: {
            select: {
              name: true,
            }
          }
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      return {
        status: 200,
        message: 'Event fetched successfully.',
        data: event,
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new InternalServerErrorException('Failed to fetch event');
    }
  }
}
