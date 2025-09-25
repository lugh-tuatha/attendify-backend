import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { OrganizationsType } from "@prisma/client"

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEnum(OrganizationsType)
  type: OrganizationsType
}