import { ChurchProcess, MemberStatus } from "@prisma/client";
import { SummaryCategory } from "./get-attendance-summary.response";

export interface DiscipleAttendanceRecord {
  firstName: string;
  lastName: string;
  memberStatus: MemberStatus | null;
  churchProcess: ChurchProcess | null;
  attendance: {
    timeIn: Date;
    isLate: boolean;
  }[];
}

export interface GetAttendanceByPrimaryLeaderResponse {
  primaryLeader: {
    firstName: string;
    lastName: string;
  } | null;
  disciples: DiscipleAttendanceRecord[];
  summary: {
    attendees: {
      total: number;
      categories: SummaryCategory[];
    },
    vips: {
      total: number;
      categories: SummaryCategory[];
    },
    totalDisciples: number;
    present: number;
    absent: number;
  }
}