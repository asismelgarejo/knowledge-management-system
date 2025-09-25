import { IModule, IMonolith } from "@/shared/types";
import { Either, left } from "fp-ts/Either";
import { bookRoutes } from "./infrastructure/http/rest/routes";

export class BookModule implements IModule {
  async start(m: IMonolith): Promise<Either<Error, void>> {
    const db = m.mongo.db();
    bookRoutes(m.fastify, db);
    return left(new Error());
  }
}
