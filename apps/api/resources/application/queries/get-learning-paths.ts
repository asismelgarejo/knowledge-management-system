import { ILearningPathRepo, LearningPathFindErrors } from "@/resources/domain/contracts";
import { LearningPath } from "@/resources/domain/entities";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetLearningPathsProps = undefined;

@QueryDecorator()
export class GetLearningPathsQuery {
  constructor(props: GetLearningPathsProps) {}
}

export type GetLearningPathsErrors = LearningPathFindErrors;

@QueryHandlerDecorator(GetLearningPathsQuery)
export class GetLearningPathsHandler implements IQueryHandler {
  constructor(private readonly repo: ILearningPathRepo) {}
  async execute(_: GetLearningPathsQuery): Promise<Either<GetLearningPathsErrors, LearningPath[]>> {
    const lpResp = await this.repo.findMany();
    if (isLeft(lpResp)) return lpResp;
    const lps = lpResp.right;
    return right(lps);
  }
}
