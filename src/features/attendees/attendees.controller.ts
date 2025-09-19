import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateAttendeeDTO } from './dto/create-attendee.dto';
import { AttendeesService } from './attendees.service';

import { GetAllAttendeesResponse } from './types/get-all-attendees.response';
import { CreateAttendeeResponse } from './types/create-attendee.response';
import { DeleteAttendeeResponse } from './types/delete-attendee.response';
import { UpdateAttendeeResponse } from './types/update-attendee.response';
import { UpdateAttendeeDTO } from './dto/update-attendee.dto';


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
  async getAllAttendees(): Promise<GetAllAttendeesResponse>  {  
    return this.attendeesService.getAllAttendees();
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