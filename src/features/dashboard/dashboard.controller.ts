import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTrendsByTimeframeDTO } from './dto/get-trends-by-timeframe.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('attendance/trends/:timeframe')
  getTrendsByTimeframe(
    @Param('timeframe') timeframe: string,
    @Query() filters: GetTrendsByTimeframeDTO
  ) {
    const validTimeframe = ['Q1', 'FIRST_HALF_YEAR', 'YEARLY']
    if (!validTimeframe.includes(timeframe)) {
      throw new Error('Invalid timeframe. Use weekly, monthly, or yearly.');
    }

    return this.dashboardService.getTrendsByTimeframe(timeframe, filters);
  }
}
