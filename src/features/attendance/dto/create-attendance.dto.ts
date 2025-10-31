import { IsDateString, IsNotEmpty, Min, IsUUID, IsNumber, IsOptional } from "class-validator";

export class CreateAttendanceDTO {
  @IsOptional()
  @IsUUID()
  attendeeId?: string;

  @IsOptional()
  @IsUUID()
  eventRegistrationId?: string;

  @IsNotEmpty()
  @IsDateString()
  timeIn: Date;

  @IsOptional()
  @IsDateString()
  timeOut?: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  weekNumber: number;

  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;
}