import { OrganizationsType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(OrganizationsType)
  type: OrganizationsType
}