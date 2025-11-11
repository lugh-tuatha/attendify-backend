import { Injectable } from '@nestjs/common';
import { GetAttendanceSummaryDTO } from './dto/get-attendance-summary.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MemberStatus } from '@prisma/client';
import { GetAttendanceSummaryResponse } from './types/get-attendance-summary.response';
import { GetAttendanceByHierarchyDTO } from './dto/get-attendance-by-hierarchy.dto';
import { GetAttendanceByHierarchyResponse } from './types/get-attendance-by-hierarchy.response';
import { GetAttendanceByPrimaryLeaderResponse } from './types/get-attendance-by-primary-leader.response';
import { GetAttendanceByPrimaryLeaderDTO } from './dto/get-attendance-by-primary-leader.dto';
import { VIP_STATUSES, ATTENDEE_STATUSES } from 'src/core/attendees/constants/member-statuses';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAttendanceSummary(filters: GetAttendanceSummaryDTO): Promise<GetAttendanceSummaryResponse> {
    const { date, eventId } = filters;

    const attendance = await this.prisma.attendance.findMany({
      where: { eventId: eventId, occuranceDate: date },
      select: { attendee: { select: { memberStatus: true, } } }
    })

    const memberStatusCounts = this.groupByMemberStatus(attendance);
    
    const attendeesCategories = ATTENDEE_STATUSES.map((status) => ({
      name: status,
      count: memberStatusCounts.get(status),
    }));

    const vipsCategories = VIP_STATUSES.map((status) => ({
      name: status,
      count: memberStatusCounts.get(status) ?? 0,
    }));

    const totalRegulars = attendeesCategories.reduce((sum, c) => sum + (c.count ?? 0), 0);
    const totalVips = vipsCategories.reduce((sum, c) => sum + (c.count ?? 0), 0);
    const totalAttendees = attendance.length;

    return {
      date: date,
      summary: {
        attendees: {
          categories: attendeesCategories,
          total: totalRegulars
        },
        vips: {
          categories: vipsCategories,
          total: totalVips
        },
        totalAttendees: totalAttendees
      }
    }
  }

  async getAttendanceByHierarchy(filters: GetAttendanceByHierarchyDTO): Promise<GetAttendanceByHierarchyResponse[]> {
    const { date, eventId, churchHierarchy } = filters;

    const primaryLeaderAttendance = await this.prisma.attendees.findMany({
      where: {
        churchHierarchy: churchHierarchy,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        attendance: {
          where: {
            eventId: eventId,
            occuranceDate: date,
          },
          select: {
            timeIn: true,
            isLate: true,
          }
        }
      },
    })

    const sortedPrimaryLeaderAttendance = primaryLeaderAttendance.sort((a, b) => {
      if (a.attendance.length > 0 && b.attendance.length === 0) return -1;
      if (a.attendance.length === 0 && b.attendance.length > 0) return 1;
      return 0;
    });

    return primaryLeaderAttendance
  }

  async getAttendanceByPrimaryLeader(filters: GetAttendanceByPrimaryLeaderDTO): Promise<GetAttendanceByPrimaryLeaderResponse> {
    const { date, eventId, primaryLeaderId } = filters;

    const [primaryLeader, disciples, attendance] = await this.prisma.$transaction([
      this.prisma.attendees.findUnique({
        where: { id: primaryLeaderId },
        select: {
          firstName: true,
          lastName: true,
        }
      }),

      this.prisma.attendees.findMany({
        where: {
          primaryLeaderId: primaryLeaderId
        },
        select: {
          firstName: true,
          lastName: true,
          memberStatus: true,
          churchProcess: true,
          attendance: {
            where: {
              eventId: eventId,
              occuranceDate: date,
            },
            select: {
              timeIn: true,
              isLate: true,
            }
          }
        }
      }),

      this.prisma.attendance.findMany({
        where: {
          eventId: eventId,
          occuranceDate: date,
          attendee: {
            primaryLeaderId: primaryLeaderId
          }
        },
        select: { attendee: { select: { memberStatus: true, } } }
      })
    ])

    const sortedDisciples = disciples.sort(
      (a, b) => b.attendance.length - a.attendance.length
    );

    const memberStatusCounts = this.groupByMemberStatus(attendance);
    
    const attendeesCategories = ATTENDEE_STATUSES.map((status) => ({
      name: status,
      count: memberStatusCounts.get(status),
    }));

    const vipsCategories = VIP_STATUSES.map((status) => ({
      name: status,
      count: memberStatusCounts.get(status) ?? 0,
    }));

    const totalRegularDisciples = attendeesCategories.reduce((sum, c) => sum + (c.count ?? 0), 0);
    const totalVipDisciples = vipsCategories.reduce((sum, c) => sum + (c.count ?? 0), 0);
    const totalDisciples = disciples.length;
    const totalDisciplesPresent = attendance.length;
    const totalDisciplesAbsent = totalDisciples - totalDisciplesPresent;


    return {
      primaryLeader: primaryLeader,
      disciples: sortedDisciples,
      summary: {
        attendees: {
          categories: attendeesCategories,
          total: totalRegularDisciples
        },
        vips: {
          categories: vipsCategories,
          total: totalVipDisciples
        },
        totalDisciples: totalDisciples,
        present: totalDisciplesPresent,
        absent: totalDisciplesAbsent,
      }
    }
  }
  
  private groupByMemberStatus(attendance: { attendee: { memberStatus: MemberStatus | null } | null }[]) {
    const map = new Map<MemberStatus, number>();
    for (const record of attendance) {
      const status = record.attendee?.memberStatus; 
      if (!status) continue;
      map.set(status, (map.get(status) ?? 0) + 1);
    }
    return map
  }
}
