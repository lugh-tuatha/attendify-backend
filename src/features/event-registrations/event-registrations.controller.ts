import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async getAllRegisteredAttendees(): Promise<EventRegistrations[]>  {  
    return this.eventRegistrationsService.getAllRegisteredAttendees();
  }

  @Get('event-id/:eventId')
  @ApiOperation({ summary: 'Get all registered attendees for an event' })
  async getAllRegisteredAttendeesForEvent(
    @Param('eventId') eventId: string
  ): Promise<EventRegistrations[]>  {  
    return this.eventRegistrationsService.getRegisteredAttendeesByEventId(eventId);
  }
}
