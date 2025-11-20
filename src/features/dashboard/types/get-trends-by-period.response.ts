interface ChartDataPoint {
  name: string;
  value: number;
}

export interface GetTrendsByPeriodResponse {
  name: string;
  series: ChartDataPoint[];
}