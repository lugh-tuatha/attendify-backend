import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { GetTrendsByTimeframeDTO } from './dto/get-trends-by-timeframe.dto';
import { formatDate } from 'src/shared/utils/date.utils';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getTrendsByTimeframe(timeframe: string, filters: GetTrendsByTimeframeDTO): Promise<any> {
    
    const results = await this.prisma.attendance.groupBy({
      by: ['occuranceDate'],
      where: {
        organizationId: filters.organizationId,
        eventId: filters.eventId,
        occuranceDate: {
          gte: `${filters.year}-01-01`,
          lte: `${filters.year}-12-31`,
        }
      },
      _count: { id: true },
      orderBy: {
        occuranceDate: 'asc',
      }
    });

    const singleSeries = {
      name: 'Attendance Trends',
      series: results.map(result => ({
        name: formatDate(result.occuranceDate, 'MmmDdYyyy'),
        value: result._count.id,
      }))
    }

    return [singleSeries];
  }
}
