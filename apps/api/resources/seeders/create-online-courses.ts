import { Application, IApplication } from "@/resources/application/application";
import { CreateOnlineCourseHandler } from "@/resources/application/commands";
import { COLLECTION_NAMES, OnlineCourseRepo } from "@/resources/infrastructure/repositories";
import { CommandBus } from "@/resources/shared/utils/cqrs/command-bus";
import { IMonolithSeeder } from "@/shared/monolith";
import { isLeft } from "fp-ts/lib/Either";
import fs from "fs";
import path from "path";
import { IQueryHandler, QueryBus } from "../shared/utils/cqrs/query-bus";

export class OnlineCoursesSeeder {
  constructor(private readonly mono: IMonolithSeeder) {}

  private getApp(): IApplication {
    const onlineCoursesRepo = OnlineCourseRepo.New(COLLECTION_NAMES.COURSES, this.mono.db);

    // commands
    const commandBus = new CommandBus();
    const createOnlineCourseHandler = new CreateOnlineCourseHandler(onlineCoursesRepo);
    const commandHandlers = [createOnlineCourseHandler];
    commandBus.register(commandHandlers);
    // queries
    const queryBus = new QueryBus();
    const queryHandlers: IQueryHandler[] = [];
    queryBus.register(queryHandlers);

    return new Application(commandBus, queryBus);
  }

  private getData() {
    const data = fs.readFileSync(path.join(__dirname, "./online-courses.json"));
    const records = JSON.parse(data.toString());
    return records;
  }

  async execute() {
    const app = this.getApp();
    const onlineCourses = this.getData();
    for await (const data of onlineCourses) {
      const response = await app.createOnlineCourse(data);
      if (isLeft(response)) {
        console.log(">>data", data);
        console.error(response.left.code);
        process.exit(0);
      }
    }

    console.log("Done!");
    process.exit(0);
  }
}
