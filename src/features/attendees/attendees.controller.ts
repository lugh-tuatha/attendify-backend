import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AttendeesService } from './attendees.service';

import { CreateAttendeeDTO } from './dto/create-attendee.dto';
import { UpdateAttendeeDTO } from './dto/update-attendee.dto';

import { GetAllAttendeesResponse } from './types/get-all-attendees.response';
import { CreateAttendeeResponse } from './types/create-attendee.response';
import { DeleteAttendeeResponse } from './types/delete-attendee.response';
import { UpdateAttendeeResponse } from './types/update-attendee.response';
import { GetAttendeeByIdResponse } from './types/get-attendee-by-id.response';

@Controller('attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendee' })
  async createAttendee(
    @Body() createAttendeeDTO: CreateAttendeeDTO
  ): Promise<CreateAttendeeResponse> {
    return this.attendeesService.createAttendee(createAttendeeDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendees' })
  async getAllAttendees(): Promise<GetAllAttendeesResponse  >  {  
    return this.attendeesService.getAllAttendees();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendee by id' })
  async getAttendeeById(
    @Param('id') id: string
  ) : Promise<GetAttendeeByIdResponse> {
    return this.attendeesService.getAttendeeById(id);
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get all attendees by organization' })
  async getAllAttendeesByOrganization(
    @Param('organizationId') organizationId: string
  ) : Promise<GetAllAttendeesResponse> {
    return this.attendeesService.getAllAttendeesByOrganization(organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendee' })
  async updateAttendee(
    @Param('id') id: string, 
    @Body() updateAttendeeDTO: UpdateAttendeeDTO
  ): Promise<UpdateAttendeeResponse> {
    return this.attendeesService.updateAttendee(id, updateAttendeeDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendee' })
  async deleteAttendee(@Param('id') id: string): Promise<DeleteAttendeeResponse> {
    return this.attendeesService.deleteAttendee(id)
  }
}