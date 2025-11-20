import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { Attendance } from '@prisma/client'; 

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';
import { GetVipsResponse } from './types/get-vips.response';
import { AttendancePaginatedResponse } from './types/attendance-paginated.response';
import { ApiWithMetaResponse } from 'src/shared/types/api-with-meta.response';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendance' })
  async createAttendance(
    @Body() createAttendanceDTO: CreateAttendanceDTO,
  ): Promise<Attendance> {
    return this.attendanceService.createAttendance(createAttendanceDTO);
  }

  @Post('/face')
  @ApiOperation({ summary: 'Recognize attendee by base64 image' })
  async checkInByFace(
    @Body() recognitionDTO: CheckInByFaceDto,
  ): Promise<CheckInByFaceResponse> {
    return this.attendanceService.checkInByFace(recognitionDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance with filters' })
  async getAllAttendance(
    @Query() filters: GetAllAttendanceDto
  ): Promise<AttendancePaginatedResponse<Attendance>> {
    return this.attendanceService.getAllAttendance(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by id' })
  async getAttendeeById(
    @Param('id', ParseUUIDPipe) id: string
  ) : Promise<Attendance> {
    return this.attendanceService.getAttendanceById(id);
  }

  @Get('slug/:slug/vip')
  @ApiOperation({ summary: 'Get all VIP attendance' })
  async getVipAttendance(
    @Param('slug') slug: string,
    @Query('date') date: string,
  ) : Promise<GetVipsResponse> {
    return this.attendanceService.getVipAttendance(slug, date);
  }

  @Get('event-id/:eventId')
  @ApiOperation({ summary: 'Get attendance by event id' })
  async getAttendanceByEventId(
    @Param('eventId') eventId: string
  ) : Promise<ApiWithMetaResponse<Attendance>> {
    return this.attendanceService.getAttendanceByEventId(eventId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance' })
  async updateAttendance(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<Attendance> {
    return this.attendanceService.updateAttendance(id, updateAttendanceDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance' })
  async deleteAttendance(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Attendance> {
    return this.attendanceService.deleteAttendance(id)
  }
}