import {
  Book,
  BookErrors,
  Documentation,
  DocumentationErrors,
  LearningPath,
  LearningPathErrors,
  OnlineCourse,
  OnlineCourseErrors,
} from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either } from "fp-ts/Either";
import { BookNotFoundError, LearningPathNotFoundError } from "../errors";

interface IRepo<Input, Reponse> {
  insertOne(entity: Input): Promise<void>;
  insertMany(entities: Input[]): Promise<void>;
  update(entity: Input): Promise<boolean>;
  updateMany(entities: Input[]): Promise<boolean>;
  findOneById(id: Id): Promise<Reponse>;
  findMany(): Promise<Input[]>;
  deleteOne(): Promise<boolean>;
  deleteMany(): Promise<boolean>;
}
//#region book
export type BookFindErrors = BookErrors | InvalidIdError | BookNotFoundError;
export type SearchManyProps = {
  search_term?: string;
};
export interface IBookRepo {
  insertOne(entity: Book): Promise<void>;
  insertMany(entities: Book[]): Promise<void>;
  update(entity: Book): Promise<boolean>;
  updateMany(entities: Book[]): Promise<boolean>;
  findOneById(id: Id): Promise<Either<BookFindErrors, Book>>;
  search(props: SearchManyProps): Promise<Either<BookFindErrors, Book[]>>;
  findMany(): Promise<Either<BookFindErrors, Book[]>>;
  deleteOne(): Promise<boolean>;
  deleteMany(): Promise<boolean>;
}
//#endregion book

//#region category
type CategoryFindErrors = BookErrors | InvalidIdError | BookNotFoundError;
type CategoryResponse = Either<CategoryFindErrors, Book>;
export interface ICategoryRepo extends IRepo<Book, CategoryResponse> {}
//#endregion category

//#region tag
type TagFindErrors = BookErrors | InvalidIdError | BookNotFoundError;
type TagResponse = Either<TagFindErrors, Book>;
export interface ITagRepo extends IRepo<Book, TagResponse> {}
//#endregion tag

//#region tag
type AuthorFindErrors = BookErrors | InvalidIdError | BookNotFoundError;
type AuthorResponse = Either<AuthorFindErrors, Book>;
export interface IAuthorRepo extends IRepo<Book, AuthorResponse> {}
//#endregion tag

//#region learning path
export type LearningPathFindErrors = LearningPathErrors | InvalidIdError | LearningPathNotFoundError;
export interface ILearningPathRepo {
  insertOne(entity: LearningPath): Promise<void>;
  insertMany(entities: LearningPath[]): Promise<void>;
  update(entity: LearningPath): Promise<boolean>;
  updateMany(entities: LearningPath[]): Promise<boolean>;
  findOneById(id: Id): Promise<Either<LearningPathFindErrors, LearningPath>>;
  findMany(): Promise<Either<LearningPathFindErrors, LearningPath[]>>;
  deleteOne(): Promise<boolean>;
  deleteMany(): Promise<boolean>;
}
//#endregion learning path

//#region online course
export type OnlineCourseFindErrors = InvalidIdError | OnlineCourseErrors;
export interface IOnlineCourseRepo {
  insertOne(entity: OnlineCourse): Promise<void>;
  insertMany(entities: OnlineCourse[]): Promise<void>;
  update(entity: OnlineCourse): Promise<boolean>;
  updateMany(entities: OnlineCourse[]): Promise<boolean>;
  findOneById(id: Id): Promise<Either<OnlineCourseFindErrors, OnlineCourse>>;
  findMany(): Promise<Either<OnlineCourseFindErrors, OnlineCourse[]>>;
  deleteOne(): Promise<boolean>;
  deleteMany(): Promise<boolean>;
}
//#endregion online course

//#region documentations
export type DocumentationFindErrors = InvalidIdError | DocumentationErrors;
export interface IDocumentationRepo {
  insertOne(entity: Documentation): Promise<void>;
  insertMany(entities: Documentation[]): Promise<void>;
  update(entity: Documentation): Promise<boolean>;
  updateMany(entities: Documentation[]): Promise<boolean>;
  findOneById(id: Id): Promise<Either<DocumentationFindErrors, Documentation>>;
  findMany(): Promise<Either<DocumentationFindErrors, Documentation[]>>;
  deleteOne(): Promise<boolean>;
  deleteMany(): Promise<boolean>;
}
//#endregion documentations
