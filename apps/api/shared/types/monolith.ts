import { FastifyInstance } from "fastify";
import { Either } from "fp-ts/Either";
import { MongoClient } from "mongodb";

export interface IMonolith {
  mongo: MongoClient;
  fastify: FastifyInstance;
}
export interface IModule<T = Error> {
  start(m: IMonolith): Promise<Either<T, void>>;
}
