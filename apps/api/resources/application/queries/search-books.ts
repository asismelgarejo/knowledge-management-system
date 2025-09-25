import { BookFindErrors, IBookRepo } from "@/resources/domain/contracts";
import { Book } from "@/resources/domain/entities";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type SearchBooksProps = {
  search_term?: string;
};

@QueryDecorator()
export class SearchBooksQuery {
  search_term?: string;
  constructor(props: SearchBooksProps) {
    this.search_term = props.search_term;
  }
}

export type SearchBooksErrors = BookFindErrors;

@QueryHandlerDecorator(SearchBooksQuery)
export class SearchBooksHandler implements IQueryHandler {
  constructor(private readonly repo: IBookRepo) {}
  async execute(query: SearchBooksQuery): Promise<Either<SearchBooksErrors, Book[]>> {
    const bookResp = await this.repo.search(query);
    if (isLeft(bookResp)) return bookResp;
    const books = bookResp.right;
    return right(books);
  }
}
