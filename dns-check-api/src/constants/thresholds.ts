export const MAX_DNS_RESOLVE_TIME_WARNING = 120; // in ms, according to https://sematext.com/glossary/dns-lookup-time/
export const MAX_DNS_RESOLVE_TIME = 300; // in ms, based on some tryouts on my own (e.g. querying from Sydney to Hungary

export const MIN_DNS_NON_CACHED = 2; // in ms, based on second-third tries for the same DNS name

// Higher because this is for the authorative server
export const MIN_SOA_TTL = 3600; // one hour in seconds
export const MAX_SOA_TTL = 86_400; // one day in seconds

// Lower because this is for the individual (e.g. "A") records
export const MIN_DNS_TTL = 300; // in seconds (5 minutes)
export const MAX_DNS_TTL = 1800; // in seconds (30 minutes)
