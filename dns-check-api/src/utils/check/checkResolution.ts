import { DnsHealthCheckStatus, MetricResult } from "../types";

const checkResolution = (resolved: boolean): MetricResult => {
  if (resolved) {
    return {
      status: DnsHealthCheckStatus.HEALTHY,
      message: "DNS resolution is OK!",
    };
  } else {
    return {
      status: DnsHealthCheckStatus.UNHEALTHY,
      message: "DNS resolution failed!",
    };
  }
};

export default checkResolution;
