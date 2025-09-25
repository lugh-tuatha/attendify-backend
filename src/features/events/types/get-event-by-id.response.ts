import { Event } from "./event.interface";

export interface GetEventByIdResponse {
  status: number;
  message: string;
  data: Event;
}