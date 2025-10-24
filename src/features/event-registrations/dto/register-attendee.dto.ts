import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class RegisterAttendeeDTO {
  @IsNotEmpty()
  @IsUUID()
  eventId: string

  @IsNotEmpty()
  @IsUUID()
  attendeeId: string

  @IsOptional()
  @IsString()
  invitedBy: string
}