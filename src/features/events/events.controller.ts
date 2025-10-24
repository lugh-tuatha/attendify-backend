import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventRegistrations, Events, Prisma } from '@prisma/client';

import { CreateEventDTO } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  async createEvent(
    @Body() createEventDTO: CreateEventDTO,
  ): Promise<Events> {
    return this.eventsService.createEvent(createEventDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async getAllAttendees(): Promise<Events[]>  {  
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  async getEventById(
    @Param('id') id: string
  ) : Promise<Events> {
    return this.eventsService.getEventById(id);
  }

  @Get(':id/attendees')
  @ApiOperation({ summary: 'Get all registered attendees' })
  async getEventAttendees(
    @Param('id') id: string,
    @Query('search') search?: string
  ) : Promise<(Prisma.EventRegistrationsGetPayload<{ include: { attendee: true } }> )[]> {
    return this.eventsService.getEventAttendees(id, search);
  }
}
