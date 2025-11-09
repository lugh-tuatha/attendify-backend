import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation } from '@nestjs/swagger';
import { GetAttendanceSummaryDTO } from './dto/get-attendance-summary.dto';
import { GetAttendanceSummaryResponse } from './types/get-attendance-summary.response';
import { GetAttendanceByHierarchyDTO } from './dto/get-attendance-by-hierarchy.dto';
import { GetAttendanceByHierarchyResponse } from './types/get-attendance-by-hierarchy.response';
import { GetAttendanceByPrimaryLeaderResponse } from './types/get-attendance-by-primary-leader.response';
import { GetAttendanceByPrimaryLeaderDTO } from './dto/get-attendance-by-primary-leader.dto';
import { ApiResponse } from 'src/shared/types/api.response';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary/attendance')
  @ApiOperation({ summary: 'Generate a weekly attendance summary' })
  async getAttendanceSummary(
    @Query() filters: GetAttendanceSummaryDTO
  ): Promise<GetAttendanceSummaryResponse> {
    return this.reportsService.getAttendanceSummary(filters);
  }

  @Get('attendance/hierarchy')
  @ApiOperation({ summary: 'Generate attendance by church hierarchy' })
  async getAttendanceByHierarchy(
    @Query() filters: GetAttendanceByHierarchyDTO
  ): Promise<GetAttendanceByHierarchyResponse[]> {
    return this.reportsService.getAttendanceByHierarchy(filters);
  }

  @Get('attendance/primary-leader')
  @ApiOperation({ summary: 'Generate attendance by primary leader' })
  async getAttendanceByPrimaryLeader(
    @Query() filters: GetAttendanceByPrimaryLeaderDTO
  ): Promise<GetAttendanceByPrimaryLeaderResponse> {
    return this.reportsService.getAttendanceByPrimaryLeader(filters);
  }
}
