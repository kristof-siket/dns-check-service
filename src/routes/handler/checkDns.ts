import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import speed from "../../utils/speed";
import checkDns from "../../services/checkDns";

type RequestParams = {
  domain: string;
};

type DnsQueryMetrics = {
  resolutionTime: number;
  isHealthy: boolean;
};

type DnsQueryResponse = {
  result: string[];
  metrics: DnsQueryMetrics;
};

const handler = async (req: Request, res: ResponseToolkit) => {
  const { domain } = req.params as RequestParams;

  const data = await speed(checkDns({ domain }));
  const isHealthy = data.latency < 50;

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
