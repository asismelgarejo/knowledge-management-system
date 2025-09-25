import { MongoClient } from "mongodb";
import { env } from "../envs";

export class MongoDB {
  private constructor(public readonly client: MongoClient) {}

  static async create(): Promise<MongoDB> {
    const connString = MongoDB.getConnString();
    const client = new MongoClient(connString);
    await client.connect();
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

    // Use standard connection string for dev/test
    return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(
      password,
    )}@${host}:${port}/${database}?authSource=admin`;
  }
}
