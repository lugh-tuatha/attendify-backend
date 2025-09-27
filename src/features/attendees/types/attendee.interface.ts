export interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  age: number | null;
  email: string | null;
  status: string | null;
  address: string | null;
  birthday: string | null;
  facebookName: string | null;
  facebookLink: string | null;
  cellLeader: string | null;
  primaryLeader: string | null;
  network: string | null;
  churchHierarchy: string | null;
  memberStatus: string | null;
  churchProcess: string | null;
  gradeLevel: string | null;
  section: string | null;
  positionTitle: string | null;
  salary: number | null;
  payrollId: string | null;
  department: string | null;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
}