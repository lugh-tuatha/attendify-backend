import { Attendance  } from "./attendance.inteface";

export interface GetAttendanceByIdResponse {
  status: number;
  message: string;
  data: Attendance;
}