import { CommandBus, ICommandBus } from "@/shared/utils/cqrs/command-bus";
import { Either } from "fp-ts/Either";
import { ClientSession, Db } from "mongodb";
import { Resource } from "../domain/entities";
import { UnitOfWork } from "../shared/uow";
import { CreateResourceCommand, HandlerCreateBookCommand } from "./commands/create-book";

// DTO de entrada
type CreateResourceDTO = {
  title: string;
};

export interface IApplication {
  createResource(data: CreateResourceDTO): Promise<Either<void, Resource>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commandRegistry: Record<string, new (props: any) => any> = {
  createResource: CreateResourceCommand,
};

// Proxy Application
export const makeApplication = (commandBus: ICommandBus): IApplication => {
  return new Proxy(
    {},
    {
      get(_, prop: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return async (data: any) => {
          const CommandClass = commandRegistry[prop];
          if (!CommandClass) {
            throw new Error(`No command registered for method: ${prop}`);
          }
          const command = new CommandClass(data);
          return commandBus.execute(command);
        };
      },
    },
  ) as IApplication;
};

const commandBus = new CommandBus();
export const getApp = (db: Db, session: ClientSession) => {
  const uow = new UnitOfWork(db, session);
  const createBookHandler = new HandlerCreateBookCommand(uow);
  const commandHandlers = [createBookHandler];
  commandBus.register(commandHandlers);
  const app = makeApplication(commandBus);
  return app;
};
