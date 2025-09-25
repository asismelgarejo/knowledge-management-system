import { DocumentationFindErrors, IDocumentationRepo } from "@/resources/domain/contracts";
import { Documentation } from "@/resources/domain/entities";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetDocumentationsProps = undefined;

@QueryDecorator()
export class GetDocumentationsQuery {
  constructor(_: GetDocumentationsProps) {}
}

export type GetDocumentationsErrors = DocumentationFindErrors;

@QueryHandlerDecorator(GetDocumentationsQuery)
export class GetDocumentationsHandler implements IQueryHandler {
  constructor(private readonly repo: IDocumentationRepo) {}
  async execute(_: GetDocumentationsQuery): Promise<Either<GetDocumentationsErrors, Documentation[]>> {
    const resp = await this.repo.findMany();
    if (isLeft(resp)) return resp;
    const records = resp.right;
    return right(records);
  }
}
