import { ICategoryRepo } from "@/resources/domain/contracts";
import { Book, BookErrors } from "@/resources/domain/entities";
import { BookNotFoundError } from "@/resources/domain/errors";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbCategory } from "../schemas/category";
import { CategorySchema } from "../schemas/category-schema";

export class CategoryRepo implements ICategoryRepo {
  private constructor(private readonly repo: Model<DbCategory>) {}

  static New(colName: string, db: Mongoose) {
    return new CategoryRepo(db.model<DbCategory>(colName, CategorySchema));
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
