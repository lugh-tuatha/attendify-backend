import { Attendance } from "./attendance.inteface";

export interface CreateAttendanceResponse {
  status: number;
  message: string;
  data: Attendance;
}