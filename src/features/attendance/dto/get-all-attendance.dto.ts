import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class GetAllAttendanceDto {
  @IsOptional()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsOptional()
  @IsString()
  memberStatus?: string;

  @IsOptional()
  @IsUUID()
  attendeeId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  week?: number;
}