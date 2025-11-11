import { Prisma } from "@prisma/client";

export const attendanceWithAttendeeStatusArgs = {
  include: {
    attendee: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        invitedBy: true,
        memberStatus: true,
      },
    },
  },
};

export type VipAttendanceRecord = Prisma.AttendanceGetPayload<
  typeof attendanceWithAttendeeStatusArgs
>;

export type GetVipsResponse = {
  FIRST_TIMER: VipAttendanceRecord[];
  SECOND_TIMER: VipAttendanceRecord[];
  THIRD_TIMER: VipAttendanceRecord[];
  FOURTH_TIMER: VipAttendanceRecord[];
}