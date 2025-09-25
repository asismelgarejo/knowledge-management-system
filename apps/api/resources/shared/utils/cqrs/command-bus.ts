import "reflect-metadata";
import { COMMAND_HANDLER_METADATA, COMMAND_METADATA } from "./constants";

export interface ICommand {}
export interface ICommandHandler {
  execute(command: ICommand): Promise<any>;
}
export interface ICommandBus {
  execute<T extends ICommand, R = any>(command: T): Promise<R>;
}

export class CommandBus implements ICommandBus {
  handlers: Map<string, ICommandHandler>;
  constructor() {
    this.handlers = new Map<string, ICommandHandler>();
  }

  async execute<T extends ICommand, R = any>(command: T): Promise<R> {
    const commandId = this.getQueryId(command);
    const handler = this.handlers.get(commandId);
    if (!handler) throw new Error(`CommandHandlerNotFoundException - ${commandId}`);
    const result = await handler.execute(command);
    return result;
  }
  private getQueryId(command: ICommand) {
    const { constructor: commandType } = Object.getPrototypeOf(command);
    const commandMetadata = Reflect.getMetadata(COMMAND_METADATA, commandType);
    if (!commandMetadata) throw new Error(`CommandHandlerNotFoundException - ${commandType.name}`);
    return commandMetadata.id;
  }
  register(handlers: ICommandHandler[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }
  private registerHandler(handler: ICommandHandler) {
    const target = this.reflectQueryId(handler);
    if (!target) throw new Error(`InvalidQueryHandlerException`);
    this.bind(handler, target);
  }
  private bind(handler: ICommandHandler, commandId: string) {
    this.handlers.set(commandId, handler);
  }
  private reflectQueryId(handler: ICommandHandler) {
    const { constructor: commandType } = Object.getPrototypeOf(handler);
    const command = Reflect.getMetadata(COMMAND_HANDLER_METADATA, commandType);
    const commandMetadata = Reflect.getMetadata(COMMAND_METADATA, command);
    return commandMetadata.id;
  }
}
