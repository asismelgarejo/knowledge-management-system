import { IOnlineCourseRepo, OnlineCourseFindErrors } from "@/resources/domain/contracts";
import { OnlineCourse } from "@/resources/domain/entities";
import { QueryDecorator, QueryHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { IQueryHandler } from "@/resources/shared/utils/cqrs/query-bus";
import { Either, isLeft, right } from "fp-ts/Either";

type GetOnlineCoursesProps = undefined;

@QueryDecorator()
export class GetOnlineCoursesQuery {
  constructor(_: GetOnlineCoursesProps) {}
}

export type GetOnlineCoursesErrors = OnlineCourseFindErrors;

@QueryHandlerDecorator(GetOnlineCoursesQuery)
export class GetOnlineCoursesHandler implements IQueryHandler {
  constructor(private readonly repo: IOnlineCourseRepo) {}
  async execute(_: GetOnlineCoursesQuery): Promise<Either<GetOnlineCoursesErrors, OnlineCourse[]>> {
    const resp = await this.repo.findMany();
    if (isLeft(resp)) return resp;
    const records = resp.right;
    return right(records);
  }
}
