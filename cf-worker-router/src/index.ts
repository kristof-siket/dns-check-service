import { Hono } from "hono";
import chooseRegion from "./chooseRegion";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/check-dns/:domain", async (c) => {
  const domain = c.req.param("domain");
  const { region, url } = chooseRegion(c.req.query("region"));

  c.res.headers.set("X-Region", region);

  console.log(`Checking ${domain} from ${url} (${region}))`);

  const res = await fetch(`${url}/check-dns/${domain}`);
  const json = await res.json();

  return c.json(json);
});

export default app;
