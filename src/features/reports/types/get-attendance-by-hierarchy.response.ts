export interface GetAttendanceByHierarchyResponse {
  id: string;
  firstName: string;
  lastName: string;
  attendance: {
    timeIn: Date;
    isLate: boolean
  }[]
}