import { OnlineCoursesSeeder } from "@/resources/seeders/create-online-courses";
import { AppConfig } from "@/shared/config";
import { MongoConfig } from "@/shared/config/mongodb";
import { isLeft } from "fp-ts/These";
import "reflect-metadata";
import { App } from "./monolith";

export async function GetApp() {
  const configResp = AppConfig.create();
  if (isLeft(configResp)) {
    console.error(configResp.left.code);
    process.exit(0);
  }
  const config = configResp.right;

  const database = await MongoConfig.create(config.database);
  const app = new App(config, database);
  return app;
}

(async () => {
  const app = await GetApp();
  const module = new OnlineCoursesSeeder(app);
  await module.execute();
})();
