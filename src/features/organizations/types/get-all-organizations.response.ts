import { Organization } from "./organization.interface";

export interface GetAllOrganizationsResponse {
  status: number;
  results: number;
  data: Organization[];
}