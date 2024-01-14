import dns, { RecordWithTtl, SoaRecord } from "dns";

const getDnsSoa = async (domain: string): Promise<SoaRecord | undefined> => {
  const dnsPromises = dns.promises;

  try {
    const result: SoaRecord = await dnsPromises.resolveSoa(domain);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export default getDnsSoa;
