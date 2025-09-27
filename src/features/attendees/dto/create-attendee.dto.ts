import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateAttendeeDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsNotEmpty()
  @IsString()
  lastName: string

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

  @IsOptional()
  @IsString()
  positionTitle: string

  @IsOptional()
  @IsInt()
  @Min(0)
  salary: number

  @IsOptional()
  @IsUUID()
  payrollId: string

  @IsOptional()
  @IsString()
  department: string

  @IsNotEmpty()
  @IsUUID()
  organizationId: string
} 