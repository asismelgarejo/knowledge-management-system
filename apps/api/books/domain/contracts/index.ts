import { Id } from "@/shared/value-objects";
import { Book } from "../entities";

export interface IResourceRepo {
  findOneById(id: Id): Promise<Book | null>;
  createOne(payload: Book): Promise<void>;
}
