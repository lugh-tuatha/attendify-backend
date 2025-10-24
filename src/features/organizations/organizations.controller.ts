import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Organizations } from '@prisma/client';

import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  async createOrganization(
    @Body() createOrganizationDTO: CreateOrganizationDTO
  ): Promise<Organizations> {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  async getAllOrganizations(): Promise<Organizations[]>  {  
    return this.organizationsService.getAllOrganizations();
  }
}
