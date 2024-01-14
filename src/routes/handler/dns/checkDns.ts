import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import speed from "../../../utils/speed";
import checkDns from "../../../services/checkDns";
import {
  MAX_DNS_RESOLVE_TIME,
  MIN_DNS_TTL,
} from "../../../constants/thresholds";
import getDnsSoa from "../../../services/getDnsSoa";
import getDnsNs from "../../../services/getDnsNs";
import { DnsHealthCheckStatus } from "../../../utils/types";
import checkTtl from "../../../utils/check/checkTtl";
import checkSpeed from "../../../utils/check/checkSpeed";
import checkResolution from "../../../utils/check/checkResolution";

type RequestParams = {
  domain: string;
};

const handler = async (req: Request, res: ResponseToolkit) => {
  try {
    const { domain } = req.params as RequestParams;

    // Metric 1: Check DNS resolution & resolution time
    const data = await speed(checkDns({ domain }));

    // "Metric" 2: Get SOA record (it can tell some server metainfo)
    const soa = await getDnsSoa(domain);

    // "Metric" 3: NS record
    const ns = await getDnsNs(domain);

    return res
      .response({
        domain,
        result: data.result,
        serverInfo: {
          soa,
          ns,
        },
        metrics: {
          resolutionTime: data.resolved ? data.latency : undefined,
          health: {
            resolution: checkResolution(data.resolved),
            latency: checkSpeed(data.latency),
            ttlSoa: soa ? checkTtl(soa?.minttl, true) : undefined,
            ttlARecords: data.result.map((r) => checkTtl(r.ttl)),
          },
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    const errRes = handleErrors(error);

    return res.response(errRes.error).code(errRes.status);
  }
};

export default handler;
