import { IOnlineCourseRepo } from "@/resources/domain/contracts";
import { OnlineCourse, OnlineCourseErrors } from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { ICommandHandler } from "@/resources/shared/utils/cqrs/command-bus";
import { CommandDecorator, CommandHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { Either, isLeft, right } from "fp-ts/Either";

type Chapter = string;
type Section = {
  name: string;
  chapters: Chapter[];
};

type Content = Section | Chapter;

type CreateOnlineCourseCommandProps = {
  name: string;
};

@CommandDecorator()
export class CreateOnlineCourseCommand {
  name: string;
  constructor(props: CreateOnlineCourseCommandProps) {
    this.name = props.name;
  }
}

export type CreateOnlineCourseErrors = OnlineCourseErrors;

@CommandHandlerDecorator(CreateOnlineCourseCommand)
export class CreateOnlineCourseHandler implements ICommandHandler {
  constructor(private readonly repo: IOnlineCourseRepo) {}
  async execute(
    command: CreateOnlineCourseCommand,
  ): Promise<Either<CreateOnlineCourseErrors | InvalidIdError, OnlineCourse>> {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    const resp = OnlineCourse.create({
      id: id,
      name: command.name,
      contents: [],
    });
    if (isLeft(resp)) return resp;
    const oc = resp.right;
    await this.repo.insertOne(oc);
    return right(oc);
  }
}
