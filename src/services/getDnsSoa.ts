import dns, { RecordWithTtl, SoaRecord } from "dns";

const getDnsSoa = async (domain: string) => {
  const dnsPromises = dns.promises;

  try {
    const result: SoaRecord = await dnsPromises.resolveSoa(domain);
    return result;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default getDnsSoa;
