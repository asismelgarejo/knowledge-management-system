import { AppConfig } from "@/shared/config";
import { IModule, IMonolithSeeder } from "@/shared/monolith";
import { Mongoose } from "mongoose";
export class App implements IMonolithSeeder {
  public modules: IModule[] = [];
  constructor(
    public readonly config: AppConfig,
    public readonly db: Mongoose,
  ) {}
}
