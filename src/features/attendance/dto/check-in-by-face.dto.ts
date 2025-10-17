import { IsNotEmpty, IsString } from "class-validator";

export class CheckInByFaceDto {
    @IsString() 
    @IsNotEmpty() 
    imageAsDataUrl: string;
}