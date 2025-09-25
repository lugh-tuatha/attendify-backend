import { Event   } from "./event.interface";

export interface CreateEventResponse {
  status: number;
  message: string;
  data: Event;
}