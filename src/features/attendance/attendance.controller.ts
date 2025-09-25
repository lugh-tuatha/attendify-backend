import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';

import { CreateAttendanceDTO } from './dto/create-attendance.dto';
import { updateAttendanceDTO } from './dto/update-attendance.dto';

import { GetAllAttendanceByOrgAndTypeResponse } from './types/get-all-attendance-by-org-and-type.response';
import { CreateAttendanceResponse } from './types/create-attendance.response';
import { DeleteAttendanceResponse } from './types/delete-attendance.response';
import { UpdateAttendanceResponse } from './types/update-attendance.response';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create an attendance' })
  async createAttendance(
    @Body() CreateAttendanceDTO: CreateAttendanceDTO,
  ): Promise<CreateAttendanceResponse> {
    return this.attendanceService.createAttendance(CreateAttendanceDTO);
  }

  @Get('organization/:organizationId/attendance-type/:attendanceTypeId')
  @ApiOperation({ summary: 'Get all attendance by organization and attendance type' })
  @ApiQuery({ name: 'week', required: true, type: Number, description: 'Filter by week number' })
  async getAllAttendanceByOrganizationAndAttendanceType(
    @Param('organizationId') organizationId: string,
    @Param('attendanceTypeId') attendanceTypeId: string,
    @Query('week', ParseIntPipe) weekNumber: number,
    @Query('member-status') memberStatus?: string
  ): Promise<GetAllAttendanceByOrgAndTypeResponse> {
    return this.attendanceService.getAllAttendanceByOrganizationAndAttendanceType(organizationId, attendanceTypeId, weekNumber, memberStatus);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance' })
  async updateAttendance(
    @Param('id') id: string, 
    @Body() UpdateAttendeeDTO: updateAttendanceDTO
  ): Promise<UpdateAttendanceResponse> {
    return this.attendanceService.updateAttendance(id, UpdateAttendeeDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance' })
  async deleteAttendance(@Param('id') id: string): Promise<DeleteAttendanceResponse> {
    return this.attendanceService.deleteAttendance(id)
  }
}