import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CheckInByFaceDto {
    @IsUUID()
    @IsNotEmpty()
    eventId: string;

    @IsNotEmpty()
    @IsBoolean()
    isLate: boolean;

    @IsUUID()
    @IsNotEmpty()
    organizationId: string;

    @IsString() 
    @IsNotEmpty() 
    imageAsDataUrl: string;
}