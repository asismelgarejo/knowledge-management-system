import { Either, right } from "fp-ts/Either";
import { FastifyClient } from "./fastify";
import { MongoDB } from "./mongo";

export class AppConfig {
  private constructor(
    public readonly mongoDb: MongoDB,
    public readonly fastify: FastifyClient,
  ) {}

  static async create(): Promise<Either<void, AppConfig>> {
    const mongoDb = await MongoDB.create();
    const fastify = FastifyClient.create();

    return right(new AppConfig(mongoDb, fastify));
  }
}
