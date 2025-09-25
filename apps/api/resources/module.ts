import { IModule, IMonolith } from "@/shared/monolith";
import mercurius from "mercurius";
import { Application } from "./application/application";
import {
  CreateBookHandler,
  CreateDocumentationHandler,
  CreateLearningPathHandler,
  CreateOnlineCourseHandler,
} from "./application/commands";
import { GetBookHandler, GetBooksHandler, GetOnlineCoursesHandler, SearchBooksHandler } from "./application/queries";
import { GetDocumentationsHandler } from "./application/queries/get-documentations";
import { GetLearningPathsHandler } from "./application/queries/get-learning-paths";
import { schema } from "./infrastructure/graphql";
import { AuthorRepo, CategoryRepo, COLLECTION_NAMES, OnlineCourseRepo, TagRepo } from "./infrastructure/repositories";
import { BookRepo } from "./infrastructure/repositories/book-repo";
import { DocumentationRepo } from "./infrastructure/repositories/documentation-repo";
import { LearningPathRepo } from "./infrastructure/repositories/learning-path-repo";
import { CommandBus } from "./shared/utils/cqrs/command-bus";
import { QueryBus } from "./shared/utils/cqrs/query-bus";

export class ResourceModule implements IModule {
  static module = "ResourceModule" as const;
  Startup(mono: IMonolith): Error | null {
    const bookRepo = BookRepo.New(COLLECTION_NAMES.BOOKS, mono.db);
    const authorRepo = AuthorRepo.New(COLLECTION_NAMES.AUTHORS, mono.db);
    const onlineCoursesRepo = OnlineCourseRepo.New(COLLECTION_NAMES.COURSES, mono.db);
    const documentationRepo = DocumentationRepo.New(COLLECTION_NAMES.DOCUMENTATIONS, mono.db);
    const categoryRepo = CategoryRepo.New(COLLECTION_NAMES.CATEGORIES, mono.db);
    const tagRepo = TagRepo.New(COLLECTION_NAMES.TAGS, mono.db);
    const learningPathRepo = LearningPathRepo.New(COLLECTION_NAMES.LEARNING_PATHS, mono.db);

    // commands
    const commandBus = new CommandBus();
    const createBookHandler = new CreateBookHandler(bookRepo);
    const createLearningPathHandler = new CreateLearningPathHandler(learningPathRepo);
    const createOnlineCourseHandler = new CreateOnlineCourseHandler(onlineCoursesRepo);
    const createDocumentationHandler = new CreateDocumentationHandler(documentationRepo);
    const commandHandlers = [
      createBookHandler,
      createLearningPathHandler,
      createOnlineCourseHandler,
      createDocumentationHandler,
    ];
    commandBus.register(commandHandlers);
    // queries
    const queryBus = new QueryBus();
    const getBookHander = new GetBookHandler(bookRepo);
    const getBooksHander = new GetBooksHandler(bookRepo);
    const getDocumentations = new GetDocumentationsHandler(documentationRepo);
    const getOnlineCoursesHandler = new GetOnlineCoursesHandler(onlineCoursesRepo);
    const searchBooksHandler = new SearchBooksHandler(bookRepo);
    const getLearningPathsHandler = new GetLearningPathsHandler(learningPathRepo);
    const queryHandlers = [
      getBookHander,
      getBooksHander,
      getLearningPathsHandler,
      searchBooksHandler,
      getOnlineCoursesHandler,
      getDocumentations,
    ];
    queryBus.register(queryHandlers);

    const application = new Application(commandBus, queryBus);

    //graphql
    mono.web.register(mercurius, {
      schema: schema,
      graphiql: true,
      context: async () => {
        return { application };
      },
    });

    console.log(`${ResourceModule.module} module started successfully`);
    return null;
  }
}
