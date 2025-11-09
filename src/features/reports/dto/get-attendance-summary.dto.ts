import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class GetAttendanceSummaryDTO {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
