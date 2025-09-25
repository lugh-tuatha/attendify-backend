import { AttendanceTypes } from "./attendance-type.interface";

export interface CreateAttendanceTypeResponse {
  status: number;
  message: string;
  data: AttendanceTypes;
}