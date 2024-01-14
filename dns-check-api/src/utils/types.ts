export enum DnsHealthCheckStatus {
  HEALTHY = "HEALTHY",
  WARNING = "WARNING",
  UNHEALTHY = "UNHEALTHY",
}

export type MetricResult = {
  status: DnsHealthCheckStatus;
  message: string;
};
