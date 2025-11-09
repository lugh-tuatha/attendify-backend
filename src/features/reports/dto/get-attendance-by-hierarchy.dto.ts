import { ChurchHierarchy } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class GetAttendanceByHierarchyDTO {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsUUID()
  eventId: string;

  @IsNotEmpty()
  @IsEnum(ChurchHierarchy)
  churchHierarchy: ChurchHierarchy;
}
