import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class GetAttendanceByPrimaryLeaderDTO {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsUUID()
  primaryLeaderId: string;
}
