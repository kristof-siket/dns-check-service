import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import speed from "../../utils/speed";
import checkDns from "../../services/checkDns";
import { MAX_DNS_RESOLVE_TIME } from "../../constants/thresholds";
import getDnsSoa from "../../services/getDnsSoa";

type RequestParams = {
  domain: string;
};

const handler = async (req: Request, res: ResponseToolkit) => {
  const { domain } = req.params as RequestParams;

  // Metric 1: Check DNS resolution & resolution time
  const data = await speed(checkDns({ domain }));

  // "Metric" 2: Get SOA record (it can tell some server metainfo)
  const soa = await getDnsSoa(domain);

  const isHealthy = data.latency < MAX_DNS_RESOLVE_TIME;

  return res
    .response({
      domain,
      result: data.result,
      serverInfo: soa,
      metrics: {
        resolutionTime: data.resolved ? data.latency : undefined,
        isHealthy: data.resolved ? isHealthy : undefined,
      },
    })
    .code(200);
};

export default handler;
