import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateEventRegistrationDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsUUID()
  attendeeId: string;

  @IsString()
  @IsOptional()
  invitedBy?: string;
}