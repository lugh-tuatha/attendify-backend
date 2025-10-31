import { MemberStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { PaginationQueryDto } from "src/shared/dto/pagination-query.dto";

export class GetAllAttendanceDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsUUID()
  eventId?: string;

  @IsOptional()
  @IsString()
  memberStatus?: MemberStatus;

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