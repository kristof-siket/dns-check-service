import {
  MAX_DNS_TTL,
  MAX_SOA_TTL,
  MIN_DNS_TTL,
  MIN_SOA_TTL,
} from "../../constants/thresholds";
import { DnsHealthCheckStatus, MetricResult } from "../types";

const checkTtl = (ttl: number, soa?: boolean): MetricResult => {
  const actualMinTtl = soa ? MIN_SOA_TTL : MIN_DNS_TTL;
  const actualMaxTtl = soa ? MAX_SOA_TTL : MAX_DNS_TTL;

  if (ttl < actualMinTtl) {
    return {
      status: DnsHealthCheckStatus.WARNING,
      message: `TTL seems to be a bit low (${ttl} seconds)! Consider increasing it to at least ${actualMinTtl} seconds for better resolution performance!`,
    };
  } else if (ttl > actualMaxTtl) {
    return {
      status: DnsHealthCheckStatus.WARNING,
      message: `TTL seems to be a bit high (${ttl} seconds)! Consider decreasing it to at most ${actualMaxTtl} seconds for applying changes faster!`,
    };
  }
  return {
    status: DnsHealthCheckStatus.HEALTHY,
    message: `TTL seems to be OK (${ttl} seconds)!`,
  };
};

export default checkTtl;
