
import { Attendance } from "./attendance.inteface";

export interface GetAllAttendanceByOrgAndTypeResponse {
  status: number;
  message: string;
  results: number;
  data: Attendance[];
} 