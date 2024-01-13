import { ServerRoute } from "@hapi/hapi";
import { DnsQueryRequestParams } from "../schemas/dns/schema";
import handler from "./handler/checkDns";

const checkDns: ServerRoute = {
  method: "GET",
  path: "/check-dns/{domain}",
  options: {
    validate: {
      params: DnsQueryRequestParams,
    },
  },
  handler,
};

export default checkDns;
