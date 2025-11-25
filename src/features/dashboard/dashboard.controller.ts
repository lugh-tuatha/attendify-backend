import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTrendsByTimeframeDTO } from './dto/get-trends-by-timeframe.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('attendees/overview/:organizationId')
  getAttendeesOverview(
    @Param('organizationId') organizationId: string,
  ) {
    return this.dashboardService.getAttendeesOverview(organizationId);
  }

  @Get('attendance/trends')
  getTrendsByTimeframe(
    @Query() filters: GetTrendsByTimeframeDTO
  ) {
    return this.dashboardService.getTrendsByTimeframe(filters);
  }
}
