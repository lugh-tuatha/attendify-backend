
import { LTHMIProfile } from "src/features/event-registrations/types/registered-attendee.interface";
import { Attendance } from "./attendance.inteface";

export interface GetAllAttendanceByOrgAndTypeResponse {
  status: number;
  message: string;
  results: number;
  data: LTHMIProfile[];
} 