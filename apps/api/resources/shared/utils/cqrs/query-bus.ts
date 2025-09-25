import "reflect-metadata";
import { QUERY_HANDLER_METADATA, QUERY_METADATA } from "./constants";

export interface IQuery {}
export interface IQueryHandler {
  execute(query: IQuery): Promise<any>;
}
export interface IQueryBus {
  execute<T extends IQuery, R = any>(query: T): Promise<R>;
}

export class QueryBus implements IQueryBus {
  handlers: Map<string, IQueryHandler>;
  constructor() {
    this.handlers = new Map<string, IQueryHandler>();
  }

  async execute<T extends IQuery, R = any>(query: T): Promise<R> {
    const queryId = this.getQueryId(query);
    const handler = this.handlers.get(queryId);
    if (!handler) throw new Error(`QueryHandlerNotFoundException - ${queryId}`);
    const result = await handler.execute(query);
    return result;
  }
  private getQueryId(query: IQuery) {
    const { constructor: queryType } = Object.getPrototypeOf(query);
    const queryMetadata = Reflect.getMetadata(QUERY_METADATA, queryType);
    if (!queryMetadata) throw new Error(`QueryHandlerNotFoundException - ${queryType.name}`);
    return queryMetadata.id;
  }
  register(handlers: IQueryHandler[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }
  private registerHandler(handler: IQueryHandler) {
    const target = this.reflectQueryId(handler);
    if (!target) throw new Error(`InvalidQueryHandlerException`);
    this.bind(handler, target);
  }
  private bind(handler: IQueryHandler, queryId: string) {
    this.handlers.set(queryId, handler);
  }
  private reflectQueryId(handler: IQueryHandler) {
    const { constructor: queryType } = Object.getPrototypeOf(handler);
    const query = Reflect.getMetadata(QUERY_HANDLER_METADATA, queryType);
    const queryMetadata = Reflect.getMetadata(QUERY_METADATA, query);
    return queryMetadata.id;
  }
}
