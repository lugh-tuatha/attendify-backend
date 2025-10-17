import { AttendeeForRecognition } from "./attendee-for-recognition";

export interface GetAllAttendeesForRecognitionResponse {
  status: number;
  results: number;
  data: AttendeeForRecognition[];
}