import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetAttendanceSummaryDTO {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  groupBy?: 'memberStatus' | 'churchProcess';
}
