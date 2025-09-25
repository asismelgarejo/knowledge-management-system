import { IModule, IMonolith } from "@/shared/types";
import { Either, left } from "fp-ts/Either";

export class BookModule implements IModule {
  async start(_m: IMonolith): Promise<Either<Error, void>> {
    // setup driven adapters
    // Rest.start(m.koaClient, m.mongo);

    return left(new Error());
  }
}
