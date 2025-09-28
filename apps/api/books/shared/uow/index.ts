import { IResourceRepo } from "@/books/domain/contracts";
import { ResourceRepo } from "@/books/infrastructure/repositories";
import { COLLECTION_NAMES } from "@/books/infrastructure/schemas";
import { ClientSession, Db } from "mongodb";

export interface IUnitOfWork {
  resourceRepo: IResourceRepo;
}

export class UnitOfWork implements IUnitOfWork {
  #resourceRepo?: IResourceRepo;
  constructor(
    private db: Db,
    private session: ClientSession,
  ) {}

  get resourceRepo(): IResourceRepo {
    if (!this.#resourceRepo) {
      this.#resourceRepo = new ResourceRepo(this.db.collection(COLLECTION_NAMES.BOOKS), this.session);
    }
    return this.#resourceRepo;
  }
  async commit(): Promise<void> {
    // await this._factoringAuctionRepo?.persist()
    await this.session.commitTransaction();
  }
}
