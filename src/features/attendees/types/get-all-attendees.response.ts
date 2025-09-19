import { Attendee } from "./attendee.interface";

export interface GetAllAttendeesResponse {
  status: number;
  results: number;
  data: Attendee[];
}