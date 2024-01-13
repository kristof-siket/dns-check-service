import dns from "dns";

type CheckDnsProps = {
  domain: string;
};

const checkDns = async ({ domain }: CheckDnsProps) => {
  const dnsPromises = dns.promises;
  const result = await dnsPromises.resolve(domain);

  console.log(`Resolved IPs for ${domain}: [${result}]`);
  return result;
};

export default checkDns;
