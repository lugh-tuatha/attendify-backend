export interface Attendance {
  id: string;
  attendeeId: string | null;
  eventRegistrationId: string | null;
  timeIn: Date;
  timeOut: Date | null;
  weekNumber: number;
  attendanceTypeId: string;
  eventId: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}