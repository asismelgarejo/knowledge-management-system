/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import "reflect-metadata";
import { v4 as uuidv4 } from "uuid";
import { ICommand } from "./command-bus";
import { COMMAND_HANDLER_METADATA, COMMAND_METADATA, QUERY_HANDLER_METADATA, QUERY_METADATA } from "./constants";
import { IQuery } from "./query-bus";

export const CommandHandlerDecorator = (command: ICommand) => {
  return (handler: Function) => Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, handler);
};
export const CommandDecorator = () => {
  return (command: Function) => Reflect.defineMetadata(COMMAND_METADATA, { id: uuidv4() }, command);
};

export const QueryHandlerDecorator = (query: IQuery) => {
  return (handler: Function) => Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, handler);
};
export const QueryDecorator = () => {
  return (query: Function) => Reflect.defineMetadata(QUERY_METADATA, { id: uuidv4() }, query);
};
