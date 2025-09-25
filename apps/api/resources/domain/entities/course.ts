import { Id } from "@/resources/shared/common-values";
import { Either, isLeft, left, right } from "fp-ts/Either";
import z from "zod";
import {
  InvalidCourseClassNameError,
  InvalidCourseContent,
  InvalidCourseNameError,
  InvalidCourseSectionNameError,
} from "../errors";

export type CourseErrors = InvalidCourseNameError | InvalidCourseContent;

export enum CourseContentTypes {
  COURSE_CLASS = "COURSE_CLASS",
  COURSE_SECTION = "COURSE_SECTION",
}
export enum CourseTypes {
  ONLINE_COURSE = "ONLINE_COURSE",
  PRESENTIAL_COURSE = "PRESENTIAL_COURSE",
}

export type CourseClass = {
  id: Id;
  name: string;
  readonly type: CourseContentTypes.COURSE_CLASS;
  duration: number;
  notes: string[];
};

export type CourseSection = {
  id: Id;
  name: string;
  readonly type: CourseContentTypes.COURSE_SECTION;
  classes: CourseClass[];
};

export type CourseContent = CourseClass | CourseSection;

export type CourseProps = {
  id: Id;
  name: string;
  contents: CourseContent[];
};
export abstract class CourseBase {
  #id: Id;
  #name: string;
  #contents: CourseContent[];
  constructor(props: CourseProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#contents = props.contents;
  }

  static ValidateName(value: string): Either<InvalidCourseNameError, void> {
    const schema = z.string().min(1);
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidCourseNameError());
    return right(undefined);
  }

  static ValidateContents(values: CourseContent[]): Either<InvalidCourseContent, void> {
    const schemaChapName = z.string().min(1);
    const schemaSectionName = z.string().min(1);

    for (const content of values) {
      switch (content.type) {
        case CourseContentTypes.COURSE_CLASS: {
          const res = schemaChapName.safeParse(content.name);
          if (!res.success) return left(new InvalidCourseClassNameError());
        }
        case CourseContentTypes.COURSE_SECTION: {
          const res = schemaSectionName.safeParse(content.name);
          if (!res.success) return left(new InvalidCourseSectionNameError());
        }
      }
    }
    return right(undefined);
  }

  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get contents() {
    return this.#contents;
  }
}

export type OnlineCourseErrors = CourseErrors;

export class OnlineCourse extends CourseBase {
  type = CourseTypes.ONLINE_COURSE as const;
  private constructor(props: CourseProps) {
    super(props);
  }

  static create(props: CourseProps): Either<OnlineCourseErrors, OnlineCourse> {
    const nameResp = CourseBase.ValidateName(props.name);
    if (isLeft(nameResp)) return nameResp;

    const contentResp = CourseBase.ValidateContents(props.contents);
    if (isLeft(contentResp)) return contentResp;

    return right(new OnlineCourse(props));
  }
}
