import { LTHMIProfile } from "./registered-attendee.interface";

export interface GetAllRegisteredAttendeeResponse {
  status: number;
  message: string;
  results: number;
  data: LTHMIProfile[];
}