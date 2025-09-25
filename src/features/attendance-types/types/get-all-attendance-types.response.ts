import { AttendanceTypes } from "./attendance-type.interface";

export interface GetAllAttendanceTypesResponse {
  status: number;
  results: number;
  data: AttendanceTypes[];
}