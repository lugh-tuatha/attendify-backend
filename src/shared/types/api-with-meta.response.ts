export interface ApiWithMetaResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalVips: number;
  };
}