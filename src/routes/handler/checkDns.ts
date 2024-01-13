import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import speed from "../../utils/speed";
import checkDns from "../../services/checkDns";
import { MAX_DNS_RESOLVE_TIME } from "../../constants/thresholds";

type RequestParams = {
  domain: string;
};

const handler = async (req: Request, res: ResponseToolkit) => {
  const { domain } = req.params as RequestParams;

  const data = await speed(checkDns({ domain }));
  const isHealthy = data.latency < MAX_DNS_RESOLVE_TIME;

  return res
    .response({
      result: data,
      metrics: {
        resolutionTime: data.latency,
        isHealthy,
      },
    })
    .code(200);
};

export default handler;
