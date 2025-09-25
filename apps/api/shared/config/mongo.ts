import { MongoClient } from "mongodb";
import { env } from "../envs";
import { logger } from "../observability";

export class MongoDB {
  private constructor(public readonly client: MongoClient) {}

  static async create(): Promise<MongoDB> {
    const connString = MongoDB.getConnString();
    const client = new MongoClient(connString, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    logger.info("Connected to MongoDB");
    return new MongoDB(client);
  }

  private static getConnString(): string {
    const { host, port, username, password, database } = env.MONGODB_CLIENT;
    if (env.NODE_ENV === "prod") {
      // Use SRV connection string for production
      return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(
        password,
      )}@${host}/?retryWrites=true&w=majority&appName=RWACluster`;
    }
    return `mongodb://${host}:${port}/${database}?replicaSet=rs0`;
  }
}
