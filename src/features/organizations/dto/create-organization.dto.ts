import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { OrganizationsType } from "generated/prisma"

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEnum(OrganizationsType)
  type: OrganizationsType
}