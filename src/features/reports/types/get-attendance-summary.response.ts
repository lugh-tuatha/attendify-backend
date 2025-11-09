import { MemberStatus } from "@prisma/client";

export interface SummaryCategory {
  name: MemberStatus;
  count: number | undefined;
}

export interface GetAttendanceSummaryResponse {
  date: string;
  summary: {
    attendees: {
      total: number;
      categories: SummaryCategory[];
    },
    vips: {
      total: number;
      categories: SummaryCategory[];
    },
    totalAttendees: number;
  }
}