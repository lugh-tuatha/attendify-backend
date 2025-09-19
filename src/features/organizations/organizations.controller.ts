import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

import { CreateOrganizationResponse } from './types/create-organization.response';
import { GetAllOrganizationsResponse } from './types/get-all-organizations.response';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  async createOrganization(
    @Body() createOrganizationDTO: CreateOrganizationDTO
  ): Promise<CreateOrganizationResponse> {
    return this.organizationsService.createOrganization(createOrganizationDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  async getAllOrganizations(): Promise<GetAllOrganizationsResponse>  {  
    return this.organizationsService.getAllOrganizations();
  }
}
