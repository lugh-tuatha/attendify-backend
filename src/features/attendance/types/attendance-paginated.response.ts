export interface AttendancePaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalVips: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}