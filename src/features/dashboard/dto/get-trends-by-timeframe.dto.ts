import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetTrendsByTimeframeDTO {
  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  year: string;
}