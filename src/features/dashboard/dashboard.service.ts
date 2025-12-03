import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { GetTrendsByTimeframeDTO } from './dto/get-trends-by-timeframe.dto';
import { formatDate } from 'src/shared/utils/date.utils';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAttendeesOverview(organizationId: string): Promise<any> {
    const resultsOrder = [
      'NEWCOMER',
      'FIRST_TIMER',
      'SECOND_TIMER',
      'THIRD_TIMER',
      'FOURTH_TIMER',
      'REGULAR_ATTENDEE',
      'REGULAR_DISCIPLE',
      'REGULAR_STARTUP',
      'BACK_TO_LIFE',
      'CHILDREN',
      'INCOMPLETE_DETAILS',
    ]
    
    const results = await this.prisma.attendees.groupBy({
      by: ['memberStatus'],
      where: {
        organizationId: organizationId,
      },
      _count: { id: true },
    });

    const mapped = results.map(result => ({
      name: result.memberStatus ?? 'INCOMPLETE_DETAILS',
      value: result._count.id,
    }))
    .sort((a, b) => resultsOrder.indexOf(a.name) - resultsOrder.indexOf(b.name));

    const totalValue = mapped.reduce((sum, item) => sum + item.value, 0);

    return [
      { name: 'TOTAL ATTENDEES' as any, value: totalValue },
      ...mapped
    ];
  }

  async getTrendsByTimeframe(filters: GetTrendsByTimeframeDTO): Promise<any> {
    const totalResults = await this.prisma.attendance.groupBy({
      by: ['occuranceDate'],
      where: {
        organizationId: filters.organizationId,
        eventId: filters.eventId,
        createdAt: {
          gte: filters.from,
          lte: filters.to,
        }
      },
      _count: { id: true },
      orderBy: {
        occuranceDate: 'asc',
      }
    });

    const vipResults = await this.prisma.attendance.groupBy({
      by: ['occuranceDate'],
      where: {
        organizationId: filters.organizationId,
        eventId: filters.eventId,
        attendee: {
          memberStatus: {
            in: [
              'FIRST_TIMER',
              'SECOND_TIMER',
              'THIRD_TIMER',
              'FOURTH_TIMER',
            ],
          },
        },
        createdAt: {
          gte: filters.from,
          lte: filters.to,
        }
      },
      _count: { id: true },
      orderBy: {
        occuranceDate: 'asc',
      }
    });

    const totalSeries = {
      name: 'Attendees',
      series: totalResults.map(result => ({
        name: formatDate(result.occuranceDate, 'MmmDdYyyy'),
        value: result._count.id,
      })),
    };

    const vipSeries = {
      name: 'VIP Attendees',
      series: vipResults.map(result => ({
        name: formatDate(result.occuranceDate, 'MmmDdYyyy'),
        value: result._count.id,
      })),
    };

    return [totalSeries, vipSeries];
  }
}
