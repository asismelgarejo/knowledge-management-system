import { BookModule } from "@/books/module";
import { AppConfig, FastifyClient, MongoDB } from "@/shared/config";
import { logger } from "@/shared/observability";
import { isLeft } from "fp-ts/These";
import "reflect-metadata";
import { App } from "./monolith";

async function run() {
  const configResp = await AppConfig.create();
  if (isLeft(configResp)) {
    process.exit(0);
  }
  const config = configResp.right;
  const app = new App(config);
  const mongo = await MongoDB.create();
  app.mongo = mongo.client;

  const fastifyClient = FastifyClient.create();
  logger.info("Starting application...", fastifyClient.port + "");
  app.fastify = fastifyClient.client;
  app.addModule(new BookModule());
  await app.startModules();
  app.fastify.listen({ port: fastifyClient.port, host: fastifyClient.host }, (err, address) => {
    if (err) {
      fastifyClient.client.log.error(err);
      process.exit(1);
    }
    logger.info(`🚀 Server listening at ${address}`);
  });
}

run()
  .then(() => {
    logger.info("Application running!");
  })
  .catch(() => {});
