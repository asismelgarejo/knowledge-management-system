import { AppConfig } from "@/shared/config";
import { IModule, IMonolith } from "@/shared/types";
import { FastifyInstance } from "fastify";
import { MongoClient } from "mongodb";
export class App implements IMonolith {
  #modules: IModule[] = [];
  #mongo!: MongoClient;
  #fastify!: FastifyInstance;
  constructor(private readonly config: AppConfig) {}

  async startModules(): Promise<void> {
    for (const m of this.#modules) {
      await m.start(this);
    }
  }
  addModule(module: IModule) {
    this.#modules.push(module);
  }

  // getters and setters
  get modules() {
    return this.#modules;
  }
  set mongo(v: MongoClient) {
    this.#mongo = v;
  }
  get mongo() {
    return this.#mongo;
  }
  set fastify(v: FastifyInstance) {
    this.#fastify = v;
  }
  get fastify() {
    return this.#fastify;
  }
}
