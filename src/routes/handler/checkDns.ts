import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import speed from "../../utils/speed";
import checkDns from "../../services/checkDns";
import { MAX_DNS_RESOLVE_TIME } from "../../constants/thresholds";
import getDnsSoa from "../../services/getDnsSoa";
import getDnsNs from "../../services/getDnsNs";

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

    const isHealthy = data.latency < MAX_DNS_RESOLVE_TIME;

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
          isHealthy: data.resolved ? isHealthy : undefined,
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return res.response({ error }).code(500);
  }
};

export default handler;
