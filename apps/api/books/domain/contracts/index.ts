import { Id } from "@/shared/value-objects";
import { Book } from "../entities";

export interface IRepository {
  findOneById(id: Id): Promise<Book | null>;
  createOne(payload: Book): Promise<void>;
}
