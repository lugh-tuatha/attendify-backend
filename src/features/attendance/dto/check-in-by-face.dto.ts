import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CheckInByFaceDto {
    @IsUUID()
    @IsNotEmpty()
    eventId: string;

    @IsUUID()
    @IsNotEmpty()
    organizationId: string;

    @IsString() 
    @IsNotEmpty() 
    imageAsDataUrl: string;
}