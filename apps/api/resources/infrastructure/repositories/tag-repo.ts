import { ITagRepo } from "@/resources/domain/contracts";
import { Book, BookErrors } from "@/resources/domain/entities";
import { BookNotFoundError } from "@/resources/domain/errors";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbTag } from "../schemas/tag";
import { TagSchema } from "../schemas/tag-schema";

export class TagRepo implements ITagRepo {
  private constructor(private readonly repo: Model<DbTag>) {}

  static New(colName: string, db: Mongoose) {
    return new TagRepo(db.model<DbTag>(colName, TagSchema));
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
