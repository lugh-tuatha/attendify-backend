export type AttendanceWithAttendee = {
  attendee: {
    memberStatus: string | null;
    churchProcess: string | null;
  } | null;
};
