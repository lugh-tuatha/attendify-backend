import { Organization } from "./organization.interface";

export interface CreateOrganizationResponse {
  status: number;
  message: string;
  data: Organization;
}