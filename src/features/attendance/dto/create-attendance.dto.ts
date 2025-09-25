import { IsDateString, IsNotEmpty, Min, IsUUID, IsNumber, IsOptional } from "class-validator";

export class CreateAttendanceDTO {
  @IsNotEmpty()
  @IsUUID()
  attendeeId: string;

  @IsNotEmpty()
  @IsDateString()
  timeIn: Date;

  @IsOptional()
  @IsDateString()
  timeOut: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  weekNumber: number;

  @IsNotEmpty()
  @IsUUID()
  attendanceTypeId: string;

  @IsOptional()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;
}