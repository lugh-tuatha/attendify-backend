import { Attendee } from "./attendee.interface";

export interface CreateAttendeeResponse {
  status: number;
  message: string;
  data: Attendee;
}