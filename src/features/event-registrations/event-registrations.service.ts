import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { RegisterAttendeeDTO } from './dto/register-attendee.dto';
import { RegisterAttendeeResponse } from './types/register-attendee.response';
import { GetAllRegisteredAttendeeResponse } from './types/get-all-registered-attendee.response';

@Injectable()
export class EventRegistrationsService {
  constructor(private prisma: PrismaService) {}
  
  async registerAttendee(payload: RegisterAttendeeDTO): Promise<RegisterAttendeeResponse> {
    try {
      const attendee = await this.prisma.eventRegistrations.create({
        data: payload,
      })

      return {
        status: 201,
        message: 'Attendee registered successfully.',
        data: attendee,
      }
    } catch (error) {
      console.error('Error registering attendee:', error);
      throw new InternalServerErrorException('Failed to register attendee');
    }
  }

  async getAllRegisteredAttendee(eventId?: string): Promise<GetAllRegisteredAttendeeResponse> {
    try {
      const events = await this.prisma.eventRegistrations.findMany({
        where: {
          eventId: eventId
        },
        include: {
          attendee: {
            select: {
              firstName: true,
              lastName: true,
              primaryLeader: true,
              memberStatus: true,
            } 
          },
          event: {
            select: {
              name: true,
            }
          }
        }
      });

      const transformedResponse = events.map((reg) => {
        return {
          firstName: reg.firstName ?? reg.attendee?.firstName ?? '',
          lastName: reg.lastName ?? reg.attendee?.lastName ?? '',
          primaryLeader: reg.primaryLeader ?? reg.attendee?.primaryLeader ?? 'N/A',
          memberStatus: reg.memberStatus ?? reg.attendee?.memberStatus ?? 'Unspecified',
        }
      })

      return {
        status: 200,
        message: 'Registered Attendee fetched successfully.',
        results: transformedResponse.length,
        data: transformedResponse,
      }
    } catch (error) {
      console.error('Error fetching Registered Attendee:', error);
      throw new InternalServerErrorException('Failed to fetch Registered Attendee');
    }
  }
}