import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationQueryDto } from "src/shared/dto/pagination-query.dto";

export class GetAllAttendeesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  organizationId: string;
}