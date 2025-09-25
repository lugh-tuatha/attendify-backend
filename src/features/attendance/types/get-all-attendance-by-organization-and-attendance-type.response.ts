
import { Attendance } from "./attendance.inteface";

export interface GetAllAttendanceByOrganizationAndAttendanceTypeResponse {
  status: number;
  message: string;
  results: number;
  data: Attendance[];
} 