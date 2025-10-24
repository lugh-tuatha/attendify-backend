import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { EventRegistrationsService } from './event-registrations.service';

import { EventRegistrations } from '@prisma/client';
import { CreateEventRegistrationDto } from './dto/create-event-registration.dto';

@Controller('event-registrations')
export class EventRegistrationsController {
  constructor(private readonly eventRegistrationsService: EventRegistrationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register Attendee' })
  async registerAttendee(
    @Body() registerAttendeeDTO: CreateEventRegistrationDto,
  ): Promise<EventRegistrations> {
    return this.eventRegistrationsService.registerAttendee(registerAttendeeDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all registered attendees' })
  async getAllEventRegistrations(): Promise<EventRegistrations[]>  {  
    return this.eventRegistrationsService.getAllEventRegistrations();
  }
}
