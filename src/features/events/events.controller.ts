import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventCategory, EventRegistrations, Events, Prisma } from '@prisma/client';

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
  async getAllEvents(): Promise<Events[]>  {  
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  async getEventById(
    @Param('id') id: string
  ) : Promise<Events> {
    return this.eventsService.getEventById(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get all events by category' })
  async getAllEventsByCategory(
    @Param('category') category: EventCategory
  ) : Promise<Events[]> {
    return this.eventsService.getAllEventsByCategory(category);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get event by slug' })
  async getEventBySlug(
    @Param('slug') slug: string
  ) : Promise<Events> {
    return this.eventsService.getEventBySlug(slug);
  }
}
