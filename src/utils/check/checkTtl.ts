import {
  MAX_DNS_TTL,
  MAX_SOA_TTL,
  MIN_DNS_TTL,
  MIN_SOA_TTL,
} from "../../constants/thresholds";
import { DnsHealthCheckStatus, MetricResult } from "../types";

const checkTtl = (ttl: number, soa?: boolean): MetricResult => {
  if (ttl < (soa ? MIN_SOA_TTL : MIN_DNS_TTL)) {
    return {
      status: DnsHealthCheckStatus.WARNING,
      message: `TTL seems to be a bit low (${ttl} seconds)! Consider increasing it to at least ${MIN_DNS_TTL} seconds for better resolution performance!`,
    };
  } else if (ttl > (soa ? MAX_SOA_TTL : MAX_DNS_TTL)) {
    return {
      status: DnsHealthCheckStatus.WARNING,
      message: `TTL seems to be a bit high (${ttl} seconds)! Consider decreasing it to at most ${MAX_DNS_TTL} seconds for applying changes faster!`,
    };
  }
  return {
    status: DnsHealthCheckStatus.HEALTHY,
    message: `TTL seems to be OK (${ttl} seconds)!`,
  };
};

export default checkTtl;
