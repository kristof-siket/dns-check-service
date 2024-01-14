# DNS Check Proof-of-Concept

Welcome to the source code repo of my DNS check API implementation!

## Basics

### Project goals

The goal of this project is to perform DNS queries and give an idea to the client whether the domain name they provided is healthy or not. To determine its health, we consider the following criteria:
1. Does it resolve? (Yes/No).
2. How long does it take to resolve? (A number representing milliseconds)
3. What TTL (time-to-live) settings are applied? (Numbers in seconds for the Start of Authority and the individual "A" records).

For each metric, we have the following states:
1. HEALTHY - everything's alright, no need to worry about this aspect.
2. WARNING - there's a room for improvement, but it is not necessarily a problem (e.g. for TTL, we use this, as we don't know what kind of website is behind the domain name, and we can only apply general advices, but none of those should "break" a check).
3. UNHEALTHY - the value is bad, action/optimization is required.

### Try it out

#### Live version

The project's entry point is a RESTful API at https://cf-worker-router.kristofsiket.workers.dev. Requests can be made using the following signature:

```
GET https://cf-worker-router.kristofsiket.workers.dev/check-dns/:domain?region=your_region
```

An example:
```
GET https://cf-worker-router.kristofsiket.workers.dev/check-dns/github.com?region=india
```

The regions that can be selected are **india**, **europe**, **usa** and **australia**.  

#### Run locally

## Details

### Metrics

### Thresholds

### Architecture

