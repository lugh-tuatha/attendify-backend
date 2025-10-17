import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { UpdateAttendanceDTO } from './dto/update-attendance.dto';
import { CheckInByFaceDto } from './dto/check-in-by-face.dto';

import { GetAllAttendanceByOrgAndTypeResponse } from './types/get-all-attendance-by-org-and-type.response';
import { CreateAttendanceResponse } from './types/create-attendance.response';
import { DeleteAttendanceResponse } from './types/delete-attendance.response';
import { UpdateAttendanceResponse } from './types/update-attendance.response';
import { GetAttendanceByIdResponse } from './types/get-attendance-by-id.response';
import { CheckInByFaceResponse } from './types/check-in-by-face.response';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendance' })
  async createAttendance(
    @Body() createAttendanceDTO: CreateAttendanceDTO,
  ): Promise<CreateAttendanceResponse> {
    return this.attendanceService.createAttendance(createAttendanceDTO);
  }

  @Post('/face')
  @ApiOperation({ summary: 'Recognize attendee by base64 image' })
  async checkInByFace(
    @Body() recognitionDTO: CheckInByFaceDto,
  ): Promise<CheckInByFaceResponse> {
    return this.attendanceService.checkInByFace(recognitionDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance by id' })
  async getAttendeeById(
    @Param('id') id: string
  ) : Promise<GetAttendanceByIdResponse> {
    return this.attendanceService.getAttendanceById(id);
  }

  @Get('organization/:organizationId/attendance-type/:attendanceTypeId')
  @ApiOperation({ summary: 'Get all attendance by organization and attendance type' })
  @ApiQuery({ name: 'week', required: true, type: Number, description: 'Filter by week number' })
  async getAllAttendanceByOrganizationAndAttendanceType(
    @Param('organizationId') organizationId: string,
    @Param('attendanceTypeId') attendanceTypeId: string,
    @Query('member-status') memberStatus?: string,
    @Query('attendee-id') attendeeId?: string,
    @Query('date') date?: string
  ): Promise<GetAllAttendanceByOrgAndTypeResponse> {
    return this.attendanceService.getAllAttendanceByOrganizationAndAttendanceType(organizationId, attendanceTypeId, memberStatus, attendeeId, date);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance' })
  async updateAttendance(
    @Param('id') id: string, 
    @Body() updateAttendanceDTO: UpdateAttendanceDTO
  ): Promise<UpdateAttendanceResponse> {
    return this.attendanceService.updateAttendance(id, updateAttendanceDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance' })
  async deleteAttendance(@Param('id') id: string): Promise<DeleteAttendanceResponse> {
    return this.attendanceService.deleteAttendance(id)
  }
}