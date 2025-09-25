import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { CreateOrganizationResponse } from './types/create-organization.response';
import { GetAllOrganizationsResponse } from './types/get-all-organizations.response';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async createOrganization(payload: CreateOrganizationDTO): Promise<CreateOrganizationResponse> {
    try {
      const organization = await this.prisma.organizations.create({
        data: payload,
      })

      return {
        status: 201,
        message: 'Organization created successfully.',
        data: organization,
      };
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new InternalServerErrorException('Failed to create organization.');
    }
  }

  async getAllOrganizations(): Promise<GetAllOrganizationsResponse> {
    try {
      const count = await this.prisma.organizations.count();
      const organizations = await this.prisma.organizations.findMany();

      return {
        status: 200,
        results: count,
        data: organizations,
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw new InternalServerErrorException('Failed to fetch organziations.');
    }
  }
}
