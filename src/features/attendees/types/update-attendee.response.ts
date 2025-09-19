import { Attendee } from "./attendee.interface"; 

export interface UpdateAttendeeResponse {
  status: number;
  message: string;
  data: Attendee;
}