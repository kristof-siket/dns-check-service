# DNS Check Proof-of-Concept

Welcome to the source code repo of my DNS check API implementation!

## Basics

### Project goals

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
GET https://cf-worker-router.kristofsiket.workers.dev/check-dns/:domain?region=selected_region
```

An example:

```
GET https://cf-worker-router.kristofsiket.workers.dev/check-dns/github.com?region=india
```

The regions that can be selected are **india**, **europe**, **usa** and **australia**. 

**Response**: an example response looks the following way (this is the result of a query from India to a Hungarian economic magazine):

```
{
    "domain": "portfolio.hu",
    "result": [
        {
            "address": "195.70.35.159",
            "ttl": 30
        }
    ],
    "serverInfo": {
        "soa": {
            "nsname": "ns.portfolio.hu",
            "hostmaster": "root.portfolio.hu",
            "serial": 2019040322,
            "refresh": 86400,
            "retry": 7200,
            "expire": 3600000,
            "minttl": 300
        },
        "ns": [
            "ns.portfolio.hu",
            "ns-slave.m.glbns.com"
        ]
    },
    "metrics": {
        "resolutionTime": 308.3278307914734,
        "health": {
            "resolution": {
                "status": "HEALTHY",
                "message": "DNS resolution is OK!"
            },
            "latency": {
                "status": "UNHEALTHY",
                "message": "DNS resolution time is too high (308.3278307914734ms)!"
            },
            "ttlSoa": {
                "status": "WARNING",
                "message": "TTL seems to be a bit low (300 seconds)! Consider increasing it to at least 3600 seconds for better resolution performance!"
            },
            "ttlARecords": [
                {
                    "status": "WARNING",
                    "message": "TTL seems to be a bit low (30 seconds)! Consider increasing it to at least 300 seconds for better resolution performance!"
                }
            ]
        }
    }
}
```

#### Run locally

As you can see, the I stuffed two projects inside this repository for making things a bit simpler. I will explain the role of the two projects at the Architecture section, for now, let's focus on starting and trying out the app locally.

Only the `dns-check-api` project is relevant for this scenario. This is a Node.js REST API using the Hapi.js framework.

1. Check out the repo (e.g. `gh repo clone kristof-siket/dns-check-service`)
2. Install dependencies (`npm i`). 
3. Start the Hapi Server: `npm run dev`.
4. You can test the app with the local version of the above mentioned example:

```
GET http://localhost:3000/check-dns/github.com
```

Notice that you don't need to pass the region in this case - this is because the API runs on your local computer, so it will always query from your location using your internet provider's DNS resolver.

If you run into any incompatibility issue, I ran the service locally using `Node.js v20.10.0` and `npm 10.2.5`. Happy testing!

## Details

Now, let me elaborate a bit on the details of the project. First, let's delve into the different metrics the API responds to the client, then talk a bit about the solution architecture.

### Metrics

The check collects essential metrics about the queried domain to determine its health status.

1. **Resolution status:** this is quite a simple yes/no type of metric. Whether the domain name resolves or not. If it doesn't resolve, the status is `UNHEALTHY` as the user needs to immediately act in case one of their domain names doesn't resolve.

2. **Resolution time:** this metric is about the time it takes to resolve the domain name. This is a bit more complex because of two things. One thing is that the time is just a number, we have to be able to tell the user whether it is good or not. Thw other thing is that DNS is a distributed system so we will receive different results from different locations. 

   -  For the first problem, I did some research and read a bit about healthy resolution times. Most sources say that anything below **120-150ms** is considered as quite good. Based on my own experimenting, sometimes for a first (uncached) resolution time it is more realistic to expect **300ms**. Therefore I introduced two stages: 120ms as a `WARNING` status threshold, and 300ms as an `UNHEALTHY` check status.


   - I solved the second problem outside of the application code. In my opinion, the DNS check service shouldn't care too much about its own location. Its single responsibility is to send a DNS query and tell the client its observations. What I did is **deployed multiple instances of this service to different parts of the world**. The clients access the service through a Router (API Gateway) which receives the selected region from the client and then the service instance living in that region does the heavy lifting. More about this in the Architecture section.

3. **TTL metrics:** (TTL SoA and TTL for individual records): one thing that the clients can optimize in their DNS setup is **caching**. TTL (Time-to-live) tells for how long the resolved values of the domain name should be cached. There is a dramatic difference between cached vs. non-cached resolution times. While a non-cached resolution time is around 20-50ms (in a healthy case), a cached time can be below 1 millisecond! When it comes to TTL, a "good" value highly depends on the goals. I went through a few articles suggesting values for SoA (provides a minimal TTL) and for individual "A" records (actual TTL that counts back). However, the check doesn't give `UNHEALTHY` status for any TTL value as there are significant differences based on how often we apply changes on a network level. But we give `WARNING` based on the info from the guideline (this part of course requires some fine tuning).

### Architecture

As I've already suggested, this system is realized in a distributed way. It has two layers:

- A **Router**, deployed as a Cloudflare Worker, written in the Hono framework (general API framework for the Edge). This lives on the Edge - a global distributed network which serves request from a location that is close to the end user. This Router does nothing but selects the right DNS Check API instance based on the region provided in the request body.

- A **DNS Check API**, written in Node.js, TypeScript, Hapi.js that actually performs the DNS queries. This is deployed to Kinsta, that runs applications in Google Kubernetes Engine under the hood.

In real life, the check would be most probably scheduled, so a scheduler component should also be added. Now, this proof-of-concept only focuses on triggering the check in a selected region and retrieving the results.

The available regions are the following (regions are GCP regions):

1. USA: dns-check-service-1yy3b.kinsta.app (us-east1)
2. India: dns-check-service-delhi-hw17z.kinsta.app (asia-south2)
3. Australia: dns-check-service-sydney-3zeg3.kinsta.app (australia-southeast1)
4. Netherlands: dns-check-service-1yy3b.kinsta.app (eu-west4)

### Improvement opportunities

As this is a proof-of-concept, naturally there is room for improvements

1. Storing historical data: currently the check provides an on-the-fly health status but it doesn't use previous check results as reference, only static numbers. By storing the measurements, we could e.g. set WARNING for values which are above or below the standard deviation, etc.
2. Fine-tuning current thresholds: by analyzing historical data, we could make the current thersholds more adaptive.
3. Increase measurement accuracy: currently we are using the `dns` package and measure its query runtime via the Node.js `perf_hooks` (`performance.now()`). As per my experimentation, this is quite accurate but we could implement these on a lower level to be even more accurate. 
4. Get DNSSEC results. Security is also a crucial point in DNS health analysis, so e.g. adding the [dnssec-js](https://github.com/relaycorp/dnssec-js) package could add some value.
