import { ChurchHierarchy, ChurchProcess, MemberStatus, Network } from "@prisma/client"
import { IsArray, IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateAttendeeDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsArray()
  @IsOptional()
  embedding: string

  @IsOptional()
  @IsInt()
  @Min(1)
  age: number

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  invitedBy: string

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
  @IsUUID()
  primaryLeaderId: string

  @IsOptional()
  @IsString()
  network: Network

  @IsOptional()
  @IsEnum(ChurchHierarchy)
  churchHierarchy: ChurchHierarchy

  @IsOptional()
  @IsEnum(MemberStatus)
  memberStatus: MemberStatus

  @IsOptional()
  @IsEnum(ChurchProcess)
  churchProcess: ChurchProcess

  @IsOptional()
  gradeLevel: string

  @IsOptional()
  @IsString()
  section: string

  @IsNotEmpty()
  @IsUUID()
  organizationId: string

  @IsOptional()
  @IsBoolean()
  isArchived: boolean
} 