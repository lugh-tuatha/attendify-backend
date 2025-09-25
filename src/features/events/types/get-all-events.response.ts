import { Event } from "./event.interface";

export interface GetAllEventResponse {
  status: number;
  message: string;
  results: number;
  data: Event[];
}