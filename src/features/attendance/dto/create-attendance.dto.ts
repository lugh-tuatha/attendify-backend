import { IsDateString, IsNotEmpty, Min, IsUUID, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class CreateAttendanceDTO {
  @IsOptional()
  @IsUUID()
  attendeeId?: string;

  @IsOptional()
  @IsUUID()
  eventRegistrationId?: string;

  @IsOptional()
  @IsDateString()
  timeOut?: Date;

  @IsNotEmpty()
  @IsBoolean()
  isLate: boolean;

  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;
}