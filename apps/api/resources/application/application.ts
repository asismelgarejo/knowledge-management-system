import { Either } from "fp-ts/Either";
import { LearningPathFindErrors } from "../domain/contracts";
import {
  Book,
  BookContentTypes,
  CourseContentTypes,
  Documentation,
  DocumentationContentTypes,
  LearningPath,
  OnlineCourse,
} from "../domain/entities";
import { BookNotFoundError } from "../domain/errors";
import { InvalidIdError } from "../shared/common-values";
import { ICommandBus } from "../shared/utils/cqrs/command-bus";
import { IQueryBus } from "../shared/utils/cqrs/query-bus";
import {
  CreateResourceCommand,
  CreateBookErrors,
  CreateDocumentationCommand,
  CreateDocumentationErrors,
  CreateLearningPathCommand,
  CreateLearningPathErrors,
  CreateOnlineCourseCommand,
  CreateOnlineCourseErrors,
} from "./commands";
import {
  GetBookErrors,
  GetBookQuery,
  GetBooksErrors,
  GetBooksQuery,
  GetLearningPathQuery,
  GetOnlineCoursesErrors,
  GetOnlineCoursesQuery,
  SearchBooksQuery,
} from "./queries";
import { GetDocumentationsErrors, GetDocumentationsQuery } from "./queries/get-documentations";
import { GetLearningPathsErrors, GetLearningPathsQuery } from "./queries/get-learning-paths";

type Chapter = string;
type Section = {
  name: string;
  chapters: Chapter[];
};

type Content = Section | Chapter;

type CreateBookDTO = {
  authors: [];
  categories: [];
  contents: Content[];
  cover: string;
  description: string;
  edition: number;
  isbn: string;
  sources: [];
  tags: [];
  title: string;
  year: number;
};

export type LearningPathGoal = {
  title: string;
  prove: string;
};

type LearningResourceBase = {
  id: string;
  name: string;
  duration: number; // In seconds
  order: number;
};
type LearningResourceBook = LearningResourceBase & {
  readonly type: BookContentTypes.CHAPTER;
  section?: string;
  book: string;
};
type LearningResourceOnlineCourse = LearningResourceBase & {
  readonly type: CourseContentTypes.COURSE_CLASS;
  section?: string;
  online_course: string;
};
type LearningResourceDocumentation = LearningResourceBase & {
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  topic?: string;
  documentation: string;
};
type LearningResourceDTO = LearningResourceBook | LearningResourceOnlineCourse | LearningResourceDocumentation;

type CreateLearningPathDTO = {
  initial_date: Date;
  title: string;
  resources: LearningResourceDTO[];
};
type OnlineCourseRequestDTO = {
  name: string;
};
type DocumentationRequestDTO = {
  name: string;
};

type GetBookDTO = {
  id: string;
};
type GetLearningPathDTO = {
  id: string;
};
type GetLearningPathsDTO = undefined;

type GetBooksDTO = undefined;
type GetOnlineCoursesDTO = undefined;
type DocumentationsDTO = undefined;
type SearchBooksDTO = {
  search_term: string;
};
export interface IApplication {
  createResource(data: CreateBookDTO): Promise<Either<CreateBookErrors | InvalidIdError, Book>>;
  createLearningPath(data: CreateLearningPathDTO): Promise<Either<CreateLearningPathErrors, LearningPath>>;
  createOnlineCourse(data: OnlineCourseRequestDTO): Promise<Either<CreateOnlineCourseErrors, OnlineCourse>>;
  createDocumentation(data: DocumentationRequestDTO): Promise<Either<CreateDocumentationErrors, Documentation>>;
  getBook(data: GetBookDTO): Promise<Either<GetBookErrors | InvalidIdError | BookNotFoundError, Book>>;
  getLearningPath(data: GetLearningPathDTO): Promise<Either<LearningPathFindErrors, LearningPath>>;
  getLearningPaths(data: GetLearningPathsDTO): Promise<Either<GetLearningPathsErrors, LearningPath[]>>;
  getBooks(data: GetBooksDTO): Promise<Either<GetBooksErrors, Book[]>>;
  getOnlineCourses(data: GetOnlineCoursesDTO): Promise<Either<GetOnlineCoursesErrors, OnlineCourse[]>>;
  getDocumentations(data: DocumentationsDTO): Promise<Either<GetDocumentationsErrors, Documentation[]>>;
  searchBooks(data: SearchBooksDTO): Promise<Either<GetBooksErrors, Book[]>>;
}
export class Application implements IApplication {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus,
  ) {}

  async createResource(data: CreateBookDTO) {
    return await this.commandBus.execute<CreateResourceCommand, Promise<Either<CreateBookErrors, Book>>>(
      new CreateResourceCommand(data),
    );
  }
  async getDocumentations(data: DocumentationsDTO): Promise<Either<GetDocumentationsErrors, Documentation[]>> {
    return await this.queryBus.execute<
      GetDocumentationsQuery,
      Promise<Either<GetDocumentationsErrors, Documentation[]>>
    >(new GetDocumentationsQuery(data));
  }
  async createDocumentation(data: DocumentationRequestDTO): Promise<Either<CreateDocumentationErrors, Documentation>> {
    return await this.commandBus.execute<
      CreateDocumentationCommand,
      Promise<Either<CreateDocumentationErrors, Documentation>>
    >(new CreateDocumentationCommand(data));
  }
  async createOnlineCourse(data: OnlineCourseRequestDTO): Promise<Either<CreateOnlineCourseErrors, OnlineCourse>> {
    return await this.commandBus.execute<
      CreateOnlineCourseCommand,
      Promise<Either<CreateOnlineCourseErrors, OnlineCourse>>
    >(new CreateOnlineCourseCommand(data));
  }
  async createLearningPath(data: CreateLearningPathDTO): Promise<Either<CreateLearningPathErrors, LearningPath>> {
    return await this.commandBus.execute<
      CreateLearningPathCommand,
      Promise<Either<CreateLearningPathErrors, LearningPath>>
    >(new CreateLearningPathCommand(data));
  }
  async getBook(data: GetBookDTO): Promise<Either<GetBookErrors | InvalidIdError | BookNotFoundError, Book>> {
    return await this.queryBus.execute<GetBookQuery, Promise<Either<CreateBookErrors, Book>>>(new GetBookQuery(data));
  }
  async getLearningPath(data: GetLearningPathDTO): Promise<Either<LearningPathFindErrors, LearningPath>> {
    return await this.queryBus.execute<GetLearningPathQuery, Promise<Either<LearningPathFindErrors, LearningPath>>>(
      new GetLearningPathQuery(data),
    );
  }
  async getOnlineCourses(data: GetOnlineCoursesDTO): Promise<Either<GetOnlineCoursesErrors, OnlineCourse[]>> {
    return await this.queryBus.execute<GetOnlineCoursesQuery, Promise<Either<GetOnlineCoursesErrors, OnlineCourse[]>>>(
      new GetOnlineCoursesQuery(data),
    );
  }
  async getBooks(data: GetBooksDTO): Promise<Either<GetBooksErrors, Book[]>> {
    return await this.queryBus.execute<GetBooksQuery, Promise<Either<GetBooksErrors, Book[]>>>(new GetBooksQuery(data));
  }
  async getLearningPaths(data: GetLearningPathsDTO): Promise<Either<LearningPathFindErrors, LearningPath[]>> {
    return await this.queryBus.execute<GetLearningPathsQuery, Promise<Either<GetLearningPathsErrors, LearningPath[]>>>(
      new GetLearningPathsQuery(data),
    );
  }
  async searchBooks(data: SearchBooksDTO): Promise<Either<GetBooksErrors, Book[]>> {
    return await this.queryBus.execute<SearchBooksQuery, Promise<Either<GetBooksErrors, Book[]>>>(
      new SearchBooksQuery(data),
    );
  }
}
