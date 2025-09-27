import { OrganizationsType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEnum(OrganizationsType)
  type: OrganizationsType
}