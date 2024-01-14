import dns from "dns";

const getDnsNs = async (domain: string): Promise<string[]> => {
  const dnsPromises = dns.promises;

  try {
    return await dnsPromises.resolveNs(domain);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getDnsNs;
