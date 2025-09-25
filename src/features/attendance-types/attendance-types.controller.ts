import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AttendanceTypesService } from './attendance-types.service';

import { CreateAttendanceTypeDTO } from './dto/create-attendance-type.dto';

import { CreateAttendanceTypeResponse } from './types/create-attendance-type.response';
import { GetAllAttendanceTypesResponse } from './types/get-all-attendance-types.response';

@Controller('attendance-types')
export class AttendanceTypesController {
  constructor(private readonly attendanceTypesService: AttendanceTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendance type' })
  async createAttendanceType(
    @Body() createAttendanceTypeDTO: CreateAttendanceTypeDTO
  ): Promise<CreateAttendanceTypeResponse> {
    return this.attendanceTypesService.createAttendanceType(createAttendanceTypeDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance type' })
  async getAllAttendees(): Promise<GetAllAttendanceTypesResponse>  {  
    return this.attendanceTypesService.getAllEvents();
  }
}
