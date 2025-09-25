import { Attendance } from "./attendance.inteface";

export interface UpdateAttendanceResponse {
  status: number;
  message: string;
  data: Attendance;
}