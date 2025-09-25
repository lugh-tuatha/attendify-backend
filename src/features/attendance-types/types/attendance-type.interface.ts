export interface AttendanceTypes {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  eventId: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}