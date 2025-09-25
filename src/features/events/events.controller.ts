import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateEventDTO } from './dto/create-event.dto';
import { CreateEventResponse } from './types/create-event.response';
import { GetAllEventResponse } from './types/get-all-events.response';
import { GetEventByIdResponse } from './types/get-event-by-id.response';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an event' })
  async createEvent(
    @Body() createEventDTO: CreateEventDTO,
  ): Promise<CreateEventResponse> {
    return this.eventsService.createEvent(createEventDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async getAllAttendees(): Promise<GetAllEventResponse>  {  
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  async getEventById(
    @Param('id') id: string
  ) : Promise<GetEventByIdResponse> {
    return this.eventsService.getEventById(id);
  }

}
