import { IBookRepo } from "@/resources/domain/contracts";
import { Book, BookErrors } from "@/resources/domain/entities";
import { BookNotFoundError } from "@/resources/domain/errors";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetBookProps = {
  id: string;
};

@QueryDecorator()
export class GetBookQuery {
  id: string;
  constructor(props: GetBookProps) {
    this.id = props.id;
  }
}

export type GetBookErrors = BookErrors;

@QueryHandlerDecorator(GetBookQuery)
export class GetBookHandler implements IQueryHandler {
  constructor(private readonly repo: IBookRepo) {}
  async execute(query: GetBookQuery): Promise<Either<GetBookErrors | InvalidIdError | BookNotFoundError, Book>> {
    const idResp = Id.create(query.id);
    if (isLeft(idResp)) return idResp;

    const bookResp = await this.repo.findOneById(idResp.right);
    if (isLeft(bookResp)) return bookResp;
    const book = bookResp.right;

    return right(book);
  }
}
