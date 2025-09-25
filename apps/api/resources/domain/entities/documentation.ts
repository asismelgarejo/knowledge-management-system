import { Id } from "@/resources/shared/common-values";
import { Either, isLeft, left, right } from "fp-ts/Either";
import z from "zod";
import { InvalidDocumentationTitleError } from "../errors";

export enum DocumentationContentTypes {
  DOCUMENTATION_SUBTOPIC = "DOCUMENTATION_SUBTOPIC",
  DOCUMENTATION_TOPIC = "DOCUMENTATION_TOPIC",
}

export type DocumentationSubtopic = {
  id: Id;
  name: string;
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  duration: number;
  notes: string[];
};

export type DocumentationTopic = {
  id: Id;
  name: string;
  readonly type: DocumentationContentTypes.DOCUMENTATION_TOPIC;
  classes: DocumentationSubtopic[];
};

export type DocumentationContent = DocumentationTopic | DocumentationSubtopic;

export type DocumentationErrors = InvalidDocumentationTitleError;

export type DocumentationProps = {
  id: Id;
  name: string;
  contents: DocumentationContent[];
};
export class Documentation {
  readonly #id: Id;
  #name: string;
  #contents: DocumentationContent[];

  private constructor(props: DocumentationProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#contents = props.contents;
  }
  static create(props: DocumentationProps): Either<DocumentationErrors, Documentation> {
    const nameResp = Documentation.ValidateName(props.name);
    if (isLeft(nameResp)) return nameResp;

    return right(new Documentation(props));
  }

  private static ValidateName(value: string): Either<InvalidDocumentationTitleError, void> {
    const schema = z.string().min(1);
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidDocumentationTitleError());
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
