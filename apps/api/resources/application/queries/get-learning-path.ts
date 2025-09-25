import { ILearningPathRepo, LearningPathFindErrors } from "@/resources/domain/contracts";
import { BookErrors, LearningPath } from "@/resources/domain/entities";
import { Id } from "@/resources/shared/common-values";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetLearningPathProps = {
  id: string;
};

@QueryDecorator()
export class GetLearningPathQuery {
  id: string;
  constructor(props: GetLearningPathProps) {
    this.id = props.id;
  }
}

export type GetLearningPathErrors = BookErrors;

@QueryHandlerDecorator(GetLearningPathQuery)
export class GetLearningPathHandler implements IQueryHandler {
  constructor(private readonly repo: ILearningPathRepo) {}
  async execute(query: GetLearningPathQuery): Promise<Either<LearningPathFindErrors, LearningPath>> {
    const idResp = Id.create(query.id);
    if (isLeft(idResp)) return idResp;

    const learningPathResp = await this.repo.findOneById(idResp.right);
    if (isLeft(learningPathResp)) return learningPathResp;
    const learningPath = learningPathResp.right;

    return right(learningPath);
  }
}
