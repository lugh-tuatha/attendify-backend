import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAttendanceTypeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsOptional()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;
}