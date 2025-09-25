import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class RegisterAttendeeDTO {
  @IsNotEmpty()
  @IsUUID()
  eventId: string

  @IsOptional()
  @IsUUID()
  attendeeId: string

  @IsOptional()
  @IsString()
  firstName: string

  @IsOptional()
  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  invitedBby: string

  @IsOptional()
  @IsString()
  primaryLeader: string

  @IsOptional()
  @IsString()
  churchHierarchy: string

  @IsOptional()
  @IsString()
  memberStatus: string
}