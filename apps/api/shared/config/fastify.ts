import cors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import { env } from "../envs";

export class FastifyClient {
  private constructor(public readonly client: FastifyInstance) {}

  static create(): FastifyClient {
    const app = fastify({ logger: false });

    app.register(cors, {
      origin: env.CORS.origin, // boolean | string | string[]
      methods: env.CORS.methods, // string[]
      allowedHeaders: env.CORS.allowedHeaders, // string[]
      credentials: env.CORS.credentials, // boolean
      maxAge: env.CORS.maxAge, // number (seconds)
    });

    return new FastifyClient(app);
  }

  get host(): string {
    return env.FASTIFY_CLIENT.host;
  }

  get port(): number {
    return env.FASTIFY_CLIENT.port;
  }

  get address(): string {
    return `http://${this.host}:${this.port}`;
  }
}
