import { EventRegistration } from "./registered-attendee.interface";

export interface RegisterAttendeeResponse {
  status: number;
  message: string;
  data: EventRegistration;
}