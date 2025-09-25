export interface Event {
  id: string;
  name: string;
  image: string | null;
  description: string;
  tagline: string;
  location: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}