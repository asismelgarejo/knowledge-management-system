import { BookFindErrors, IBookRepo } from "@/resources/domain/contracts";
import { Book } from "@/resources/domain/entities";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetBooksProps = undefined;

@QueryDecorator()
export class GetBooksQuery {
  constructor(_: GetBooksProps) {}
}

export type GetBooksErrors = BookFindErrors;

@QueryHandlerDecorator(GetBooksQuery)
export class GetBooksHandler implements IQueryHandler {
  constructor(private readonly repo: IBookRepo) {}
  async execute(_: GetBooksQuery): Promise<Either<GetBooksErrors, Book[]>> {
    const bookResp = await this.repo.findMany();
    if (isLeft(bookResp)) return bookResp;
    const books = bookResp.right;
    return right(books);
  }
}
