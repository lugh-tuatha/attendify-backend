import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { Organizations } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async createOrganization(payload: CreateOrganizationDTO): Promise<Organizations> {
    const organization = await this.prisma.organizations.create({
      data: payload,
    })

    return organization
  }

  async getAllOrganizations(): Promise<Organizations[]> {
    const organizations = await this.prisma.organizations.findMany();

    return organizations
  }
}
