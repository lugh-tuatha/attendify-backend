import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { CreateAttendeeDTO } from './dto/create-attendee.dto';
import { UpdateAttendeeDTO } from './dto/update-attendee.dto';

import { CreateAttendeeResponse } from './types/create-attendee.response';
import { GetAllAttendeesResponse } from './types/get-all-attendees.response';
import { DeleteAttendeeResponse } from './types/delete-attendee.response';
import { UpdateAttendeeResponse } from './types/update-attendee.response';
import { GetAttendeeByIdResponse } from './types/get-attendee-by-id.response';

@Injectable()
export class AttendeesService {
  constructor(private prisma: PrismaService) {}

  async createAttendee(payload: CreateAttendeeDTO): Promise<CreateAttendeeResponse> {
    try {
      const attendee = await this.prisma.attendees.create({
        data: payload,
      })
      
      return {
        status: 201,
        message: 'Attendee created successfully.',
        data: attendee,
      };
    } catch (error) {
      console.error('Error creating attendee:', error);
      throw new InternalServerErrorException('Failed to create attendee');
    }
  }

  async getAllAttendees(): Promise<GetAllAttendeesResponse> {
    try {
      const attendees = await this.prisma.attendees.findMany();

      return {
        status: 200,
        results: attendees.length,
        data: attendees,
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
      throw new InternalServerErrorException('Failed to fetch attendees');
    }
  }

  async getAttendeeById(id: string): Promise<GetAttendeeByIdResponse> {
    try {
      const attendee = await this.prisma.attendees.findUnique({
        where: { id },
      })

      if (!attendee) {
        throw new NotFoundException('Attendee not found');
      }

      return {
        status: 200,
        message: 'Attendee found successfully.',
        data: attendee,
      }
    } catch (error) {
      console.error('Error fetching attendee:', error);
      throw new InternalServerErrorException('Failed to fetch attendee');
    }
  }

  async getAllAttendeesByOrganization(organizationId: string): Promise<GetAllAttendeesResponse> {
    try {
      const attendees = await this.prisma.attendees.findMany({
        where: { organizationId: organizationId }
      });

      return {
        status: 200,
        results: attendees.length,
        data: attendees,
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
      throw new InternalServerErrorException('Failed to fetch attendees');
    }
  }

  async updateAttendee(id: string, payload: UpdateAttendeeDTO): Promise<UpdateAttendeeResponse> {
    try {
      const updatedAttendee = await this.prisma.attendees.update({
        where: { id },
        data: payload,
      });

      return {
        status: 200,
        message: 'Attendee updated successfully',
        data: updatedAttendee,
      };
    } catch (error) {
      console.error('Error updating attendee:', error);
      throw new InternalServerErrorException('Failed to update attendee');
    }
  }

  async deleteAttendee(id: string): Promise<DeleteAttendeeResponse> {
    try {
      await this.prisma.attendees.delete({
        where: { id }
      })  

      return {
        success: true,
        message: 'Attendee deleted successfully.',
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
