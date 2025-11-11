import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';
import { Attendees, ChurchHierarchy, MemberStatus } from '@prisma/client';

import { CreateAttendeeDTO } from './dto/create-attendee.dto';
import { UpdateAttendeeDTO } from './dto/update-attendee.dto';
import { AttendeeForRecognition } from './types/attendee-for-recognition.types';
import { PaginatedResponse } from 'src/shared/types/paginated.response';
import { GetAllAttendeesDto } from './dto/get-all-attendees.dto';

@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendee' })
  async createAttendee(
    @Body() createAttendeeDTO: CreateAttendeeDTO
  ): Promise<Attendees> {
    return this.attendeesService.createAttendee(createAttendeeDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendees' })
  async getAllAttendees(
    @Query() filters: GetAllAttendeesDto
  ): Promise<PaginatedResponse<Attendees>>  {  
    return this.attendeesService.getAllAttendees(filters);
  } 

  @Get('organization/:organizationId/for-recognition')
  @ApiOperation({ summary: 'Get all attendees for recognition' })
  async getAllAttendeesForRecognition(
    @Param('organizationId') organizationId: string
  ): Promise<AttendeeForRecognition[]>  {  
    return this.attendeesService.getAllAttendeesForRecognition(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendee by id' })
  async getAttendeeById(
    @Param('id') id: string
  ) : Promise<Attendees> {
    return this.attendeesService.getAttendeeById(id);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get all attendees by organization' })
  async getAllAttendeesByOrganization(
    @Param('organizationId') organizationId: string
  ) : Promise<Attendees[]> {
    return this.attendeesService.getAllAttendeesByOrganization(organizationId);
  }

  @Get('church-hierarchy/:churchHierarchy')
  @ApiOperation({ summary: 'Get all attendees by church hierarchy' })
  async getAllAttendeesByChurchHierarchy(
    @Param('churchHierarchy') churchHierarchy: ChurchHierarchy
  ) : Promise<Attendees[]> {
    return this.attendeesService.getAllAttendeesByChurchHierarchy(churchHierarchy);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendee' })
  async updateAttendee(
    @Param('id') id: string, 
    @Body() updateAttendeeDTO: UpdateAttendeeDTO
  ): Promise<Attendees> {
    return this.attendeesService.updateAttendee(id, updateAttendeeDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendee' })
  async deleteAttendee(@Param('id') id: string): Promise<Attendees> {
    return this.attendeesService.deleteAttendee(id)
  }
}