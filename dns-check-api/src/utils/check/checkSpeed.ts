import {
  MAX_DNS_RESOLVE_TIME,
  MAX_DNS_RESOLVE_TIME_WARNING,
  MIN_DNS_NON_CACHED,
} from "../../constants/thresholds";
import { DnsHealthCheckStatus } from "../types";

const checkSpeed = (resolutionTime: number) => {
  if (resolutionTime < MIN_DNS_NON_CACHED) {
    return {
      status: DnsHealthCheckStatus.HEALTHY,
      message: `DNS resolution time is OK (${resolutionTime}ms)! It seems that the DNS record was cached!`,
    };
  } else if (resolutionTime < MAX_DNS_RESOLVE_TIME_WARNING) {
    return {
      status: DnsHealthCheckStatus.HEALTHY,
      message: `DNS resolution time is OK (${resolutionTime}ms)!`,
    };
  } else if (
    resolutionTime > MAX_DNS_RESOLVE_TIME_WARNING &&
    resolutionTime < MAX_DNS_RESOLVE_TIME
  ) {
    return {
      status: DnsHealthCheckStatus.WARNING,
      message: `DNS resolution time is a bit high (${resolutionTime}ms)!`,
    };
  } else {
    return {
      status: DnsHealthCheckStatus.UNHEALTHY,
      message: `DNS resolution time is too high (${resolutionTime}ms)!`,
    };
  }
};

export default checkSpeed;
