export interface Attendance {
  id: string;
  attendeeId: string;
  timeIn: Date;
  timeOut: Date | null;
  weekNumber: number;
  attendanceTypeId: string;
  eventId: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}