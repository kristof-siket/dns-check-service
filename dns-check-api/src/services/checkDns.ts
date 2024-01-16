import dns, { RecordWithTtl } from "dns";

type CheckDnsProps = {
  domain: string;
};

const checkDns = async ({ domain }: CheckDnsProps) => {
  try {
    const dnsPromises = dns.promises;
    const result: RecordWithTtl[] = await dnsPromises.resolve4(domain, {
      ttl: true,
    });

    console.log(
      `Resolved IPs for ${domain}: [${result.map((r) => r.address).join(", ")}]`
    );

    return {
      resolved: true,
      result,
    };
  } catch (err) {
    console.error(err);

    if (err.code === "ENOTFOUND") {
      console.log(`Domain ${domain} could not be resolved!`);
      return {
        resolved: false,
        result: [],
      };
    }

    throw err;
  }
};

export default checkDns;
