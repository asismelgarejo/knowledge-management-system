import { ILearningPathRepo } from "@/resources/domain/contracts";
import { BookContentTypes, CourseContentTypes, DocumentationContentTypes } from "@/resources/domain/entities";
import { LearningPath, LearningPathErrors, LearningResource } from "@/resources/domain/entities/learning-path";
import { Id } from "@/resources/shared/common-values";
import { ICommandHandler } from "@/resources/shared/utils/cqrs/command-bus";
import { CommandDecorator, CommandHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { isLeft, right } from "fp-ts/Either";

export type LearningPathGoal = {
  title: string;
  prove: string;
};

type LearningResourceBase = {
  id: string;
  name: string;
  duration: number; // In seconds
  order: number;
};
type LearningResourceBook = LearningResourceBase & {
  readonly type: BookContentTypes.CHAPTER;
  section?: string;
  book: string;
};
type LearningResourceOnlineCourse = LearningResourceBase & {
  readonly type: CourseContentTypes.COURSE_CLASS;
  section?: string;
  online_course: string;
};
type LearningResourceDocumentation = LearningResourceBase & {
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  topic?: string;
  documentation: string;
};
type CommandLearningResource = LearningResourceBook | LearningResourceOnlineCourse | LearningResourceDocumentation;
type CreateLearningPathCommandProps = {
  initial_date: Date;
  title: string;
  resources: CommandLearningResource[];
};

@CommandDecorator()
export class CreateLearningPathCommand {
  initial_date: Date;
  title: string;
  resources: CommandLearningResource[];
  constructor(props: CreateLearningPathCommandProps) {
    this.initial_date = props.initial_date;
    this.title = props.title;
    this.resources = props.resources;
  }
}

export type CreateLearningPathErrors = LearningPathErrors;

@CommandHandlerDecorator(CreateLearningPathCommand)
export class CreateLearningPathHandler implements ICommandHandler {
  constructor(private readonly repo: ILearningPathRepo) {}
  async execute(command: CreateLearningPathCommand) {
    const lpIdResp = Id.create();
    if (isLeft(lpIdResp)) return lpIdResp;
    const lpId = lpIdResp.right;

    const resources: LearningResource[] = [];

    for (const resource of command.resources) {
      const idResp = Id.create(resource.id);
      if (isLeft(idResp)) return idResp;
      const id = idResp.right;

      switch (resource.type) {
        case BookContentTypes.CHAPTER:
          resources.push({
            id: id,
            name: resource.name,
            duration: resource.duration,
            order: resource.order,
            type: resource.type,
            section: resource.section,
            book: resource.book,
          });
          break;
        case CourseContentTypes.COURSE_CLASS:
          resources.push({
            id: id,
            name: resource.name,
            order: resource.order,
            duration: resource.duration,
            type: resource.type,
            section: resource.section,
            online_course: resource.online_course,
          });
          break;
        case DocumentationContentTypes.DOCUMENTATION_SUBTOPIC:
          resources.push({
            id: id,
            name: resource.name,
            duration: resource.duration,
            type: resource.type,
            topic: resource.topic,
            order: resource.order,
            documentation: resource.documentation,
          });
          break;
      }
    }

    const lpResp = LearningPath.create({
      id: lpId,
      initialDate: command.initial_date,
      resources: resources,
      title: command.title,
    });
    if (isLeft(lpResp)) return lpResp;
    const book = lpResp.right;
    await this.repo.insertOne(book);
    return right(book);
  }
}
