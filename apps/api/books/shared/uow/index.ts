import { IRepository } from "@/books/domain/contracts";
import { BookRepository } from "@/books/infrastructure/repositories/book.repository";
import { COLLECTION_NAMES } from "@/books/infrastructure/schemas";
import { ClientSession, Db } from "mongodb";

export interface IUnitOfWork {
  bookRepo: IRepository;
}

export class UnitOfWork implements IUnitOfWork {
  #bookRepo?: IRepository;
  constructor(
    private db: Db,
    private session: ClientSession,
  ) {}

  get bookRepo(): IRepository {
    if (!this.#bookRepo) {
      this.#bookRepo = new BookRepository(this.db.collection(COLLECTION_NAMES.BOOKS), this.session);
    }
    return this.#bookRepo;
  }
  async commit(): Promise<void> {
    // await this._factoringAuctionRepo?.persist()
    await this.session.commitTransaction();
  }
}
