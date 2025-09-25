import { Id } from "@/resources/shared/common-values";
import { Either, isLeft, left, right } from "fp-ts/Either";
import z from "zod";
import {
  InvalidLearningPathInitialDateError,
  InvalidLearningPathResourceDurationError,
  InvalidLearningPathTitleError,
} from "../errors";
import { BookContentTypes } from "./book";
import { CourseContentTypes } from "./course";
import { DocumentationContentTypes } from "./documentation";

//#region enums

//#endregion

export type LearningPathGoal = {
  title: string;
  prove: string;
};

export type LearningResourceBase = {
  id: Id;
  name: string;
  duration: number; // In seconds
  order: number; // In seconds
};
export type LearningResourceBook = LearningResourceBase & {
  readonly type: BookContentTypes.CHAPTER;
  section?: string;
  book: string;
};
export type LearningResourceOnlineCourse = LearningResourceBase & {
  readonly type: CourseContentTypes.COURSE_CLASS;
  section?: string;
  online_course: string;
};
export type LearningResourceDocumentation = LearningResourceBase & {
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  topic?: string;
  documentation: string;
};
export type LearningResource = LearningResourceBook | LearningResourceOnlineCourse | LearningResourceDocumentation;

export type LearningPathErrors =
  | InvalidLearningPathTitleError
  | InvalidLearningPathInitialDateError
  | InvalidLearningPathResourceDurationError
  | InvalidLearningPathResourceDurationError;

export type LearningPathProps = {
  id: Id;
  title: string;
  initialDate: Date;
  resources: LearningResource[];
};
export class LearningPath {
  readonly #id: Id;
  #title: string;
  #initialDate: Date;
  #resources: LearningResource[];

  private constructor(props: LearningPathProps) {
    this.#id = props.id;
    this.#title = props.title;
    this.#initialDate = props.initialDate;
    this.#resources = props.resources;
  }
  static create(props: LearningPathProps): Either<LearningPathErrors, LearningPath> {
    const titleResp = LearningPath.ValidateTitle(props.title);
    if (isLeft(titleResp)) return titleResp;
    const initialDateResp = LearningPath.ValidateInitialDate(props.initialDate);
    if (isLeft(initialDateResp)) return initialDateResp;

    const resourcesResp = LearningPath.ValidateResources(props.resources);
    if (isLeft(resourcesResp)) return resourcesResp;

    return right(new LearningPath(props));
  }

  private static ValidateTitle(value: string): Either<InvalidLearningPathTitleError, void> {
    const schema = z.string().min(1);
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidLearningPathTitleError());
    return right(undefined);
  }
  private static ValidateInitialDate(value: Date): Either<InvalidLearningPathInitialDateError, void> {
    const minDate = new Date();
    const schema = z.date();
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidLearningPathInitialDateError());
    return right(undefined);
  }

  private static ValidateResources(values: LearningResource[]): Either<InvalidLearningPathResourceDurationError, void> {
    return right(undefined);
  }

  get id() {
    return this.#id;
  }
  get title() {
    return this.#title;
  }
  get initialDate() {
    return this.#initialDate;
  }
  get resources() {
    return this.#resources;
  }
}
