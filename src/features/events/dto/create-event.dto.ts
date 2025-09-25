import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  tagline: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;
  
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;
}