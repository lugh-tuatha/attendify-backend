import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { Attendance } from '@prisma/client'; 

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { PaginatedResponse } from 'src/shared/types/paginated.response';
import { GetAllAttendanceDto } from './dto/get-all-attendance.dto';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';

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
  ): Promise<PaginatedResponse<Attendance>> {
    return this.attendanceService.getAllAttendance(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by id' })
  async getAttendeeById(
    @Param('id', ParseUUIDPipe) id: string
  ) : Promise<Attendance> {
    return this.attendanceService.getAttendanceById(id);
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