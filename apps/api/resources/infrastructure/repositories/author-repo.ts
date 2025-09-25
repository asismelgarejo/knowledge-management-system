import { IAuthorRepo } from "@/resources/domain/contracts";
import { Book, BookErrors } from "@/resources/domain/entities";
import { BookNotFoundError } from "@/resources/domain/errors";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbAuthor } from "../schemas/author";
import { AuthorSchema } from "../schemas/author-schema";

export class AuthorRepo implements IAuthorRepo {
  private constructor(private readonly repo: Model<DbAuthor>) {}

  static New(colName: string, db: Mongoose) {
    return new AuthorRepo(db.model<DbAuthor>(colName, AuthorSchema));
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }
  async deleteOne(): Promise<boolean> {
    return true;
  }
  async findMany(): Promise<Book[]> {
    return [];
  }
  async findOneById(id: Id): Promise<Either<BookErrors | InvalidIdError | BookNotFoundError, Book>> {
    throw new Error("asdasd");
  }
  async insertMany(entities: Book[]): Promise<void> {}
  async insertOne(entity: Book): Promise<void> {
    throw new Error("asdasd");
  }
  async update(entity: Book): Promise<boolean> {
    return true;
  }
  async updateMany(entities: Book[]): Promise<boolean> {
    return true;
  }
}
