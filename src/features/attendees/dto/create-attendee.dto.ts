import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateAttendeeDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

  @IsArray()
  @IsOptional()
  embedding: string

  @IsOptional()
  @IsInt()
  @Min(0)
  age: number

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  status: string

  @IsOptional()
  @IsString()
  address: string

  @IsOptional()
  @IsString()
  birthday: string

  @IsOptional()
  @IsString()
  facebookName: string

  @IsOptional()
  @IsString()
  facebookLink: string

  @IsOptional()
  @IsString()
  cellLeader: string

  @IsOptional()
  @IsString()
  primaryLeader: string

  @IsOptional()
  @IsString()
  network: string

  @IsOptional()
  @IsString()
  churchHierarchy: string

  @IsOptional()
  @IsString()
  memberStatus: string

  @IsOptional()
  @IsString()
  churchProcess: string

  @IsOptional()
  gradeLevel: string

  @IsOptional()
  @IsString()
  section: string

  @IsNotEmpty()
  @IsUUID()
  organizationId: string
} 