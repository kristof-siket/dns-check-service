import Hapi from "@hapi/hapi";
import { Server } from "@hapi/hapi";
import checkDns from "./routes/checkDns";

export let server: Server;

export const init = async function (): Promise<Server> {
  server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
  });

  // Routes will go here
  server.route([checkDns]);

  return server;
};

export const start = async function (): Promise<void> {
  console.log(
    `Listening on http://${server.settings.host}:${server.settings.port}`
  );
  return server.start();
};

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection");
  console.error(err);
  process.exit(1);
});
