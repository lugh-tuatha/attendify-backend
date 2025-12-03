import { MemberStatus } from "@prisma/client";

export interface SummaryCategory<T = string> {
  name: T | 'INCOMPLETE_DETAILS';
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