import { Attendee } from "./attendee.interface";

export interface GetAttendeeByIdResponse {
  status: number;
  message: string;
  data: Attendee;
}