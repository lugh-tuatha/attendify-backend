import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EventRegistrationsService } from './event-registrations.service';

import { RegisterAttendeeDTO } from './dto/register-attendee.dto';
import { RegisterAttendeeResponse } from './types/register-attendee.response';
import { GetAllRegisteredAttendeeResponse } from './types/get-all-registered-attendee.response';

@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register Attendee' })
  async registerAttendee(
    @Body() registerAttendeeDTO: RegisterAttendeeDTO,
  ): Promise<RegisterAttendeeResponse> {
    return this.eventRegistrationsService.registerAttendee(registerAttendeeDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get registered Attendee' })
  @ApiQuery({ name: 'event-id', required: false, type: String, description: 'Get Registered Attendee by event id' })
  async getAllRegisteredAttendee(
    @Query('event-id') eventId?: string,
  ): Promise<GetAllRegisteredAttendeeResponse>  {  
    return this.eventRegistrationsService.getAllRegisteredAttendee(eventId);
  }
}
