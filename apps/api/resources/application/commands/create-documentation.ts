import { IDocumentationRepo } from "@/resources/domain/contracts";
import { Documentation, DocumentationErrors } from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { ICommandHandler } from "@/resources/shared/utils/cqrs/command-bus";
import { CommandDecorator, CommandHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { Either, isLeft, right } from "fp-ts/Either";

type Subtopic = string;
type Topic = {
  name: string;
  subtopics: Subtopic[];
};

type Content = Topic | Subtopic;

type CreateDocumentationCommandProps = {
  name: string;
};

@CommandDecorator()
export class CreateDocumentationCommand {
  name: string;
  constructor(props: CreateDocumentationCommandProps) {
    this.name = props.name;
  }
}

export type CreateDocumentationErrors = DocumentationErrors;

@CommandHandlerDecorator(CreateDocumentationCommand)
export class CreateDocumentationHandler implements ICommandHandler {
  constructor(private readonly repo: IDocumentationRepo) {}
  async execute(
    command: CreateDocumentationCommand,
  ): Promise<Either<CreateDocumentationErrors | InvalidIdError, Documentation>> {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    const resp = Documentation.create({
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
