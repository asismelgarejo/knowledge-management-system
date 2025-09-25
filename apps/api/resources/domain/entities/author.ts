import { Id } from "@/resources/shared/common-values";
import { Either, isLeft, left, right } from "fp-ts/Either";
import z from "zod";
import { InvalidAuthorFirstNameError, InvalidAuthorImageError, InvalidAuthorLastNameError } from "../errors";

export type AuthorErrors = InvalidAuthorFirstNameError | InvalidAuthorLastNameError | InvalidAuthorImageError;

export type AuthorProps = {
  id: Id;
  firstName: string;
  lastName1?: string;
  lastName2?: string;
  image?: string;
};

export class Author {
  readonly #id: Id;
  #firstName: string;
  #lastName1?: string;
  #lastName2?: string;
  #image?: string;

  private constructor(props: AuthorProps) {
    this.#id = props.id;
    this.#firstName = props.firstName;
    this.#lastName1 = props.lastName1;
    this.#lastName2 = props.lastName2;
    this.#image = props.image;
  }
  static create(props: AuthorProps): Either<AuthorErrors, Author> {
    const firstNameResp = this.ValidateFirstName(props.firstName);
    if (isLeft(firstNameResp)) return firstNameResp;

    if (props.lastName1) {
      const lastName1Resp = this.ValidateLastName(props.lastName1);
      if (isLeft(lastName1Resp)) return lastName1Resp;
    }

    if (props.lastName2) {
      const lastName2Resp = this.ValidateLastName(props.lastName2);
      if (isLeft(lastName2Resp)) return lastName2Resp;
    }

    if (props.image) {
      const imageResp = this.ValidateImage(props.image);
      if (isLeft(imageResp)) return imageResp;
    }

    return right(new Author(props));
  }

  private static ValidateFirstName(value: string): Either<InvalidAuthorFirstNameError, void> {
    const schema = z.string().min(1);
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidAuthorFirstNameError());
    return right(undefined);
  }

  private static ValidateLastName(value: string): Either<InvalidAuthorLastNameError, void> {
    const schema = z.string().min(1);
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidAuthorLastNameError());
    return right(undefined);
  }

  private static ValidateImage(value: string): Either<InvalidAuthorImageError, void> {
    const schema = z.string().url();
    const res = schema.safeParse(value);
    if (!res.success) return left(new InvalidAuthorImageError());
    return right(undefined);
  }

  updateFirstName(value: string): Either<InvalidAuthorFirstNameError, void> {
    const resp = Author.ValidateFirstName(value);
    if (isLeft(resp)) return resp;
    this.#firstName = value;
    return right(undefined);
  }

  updateLastName1(value: string): Either<InvalidAuthorLastNameError, void> {
    const resp = Author.ValidateLastName(value);
    if (isLeft(resp)) return resp;
    this.#lastName1 = value;
    return right(undefined);
  }

  updateLastName2(value: string): Either<InvalidAuthorLastNameError, void> {
    const resp = Author.ValidateLastName(value);
    if (isLeft(resp)) return resp;
    this.#lastName2 = value;
    return right(undefined);
  }

  updateImage(value: string): Either<InvalidAuthorImageError, void> {
    const resp = Author.ValidateImage(value);
    if (isLeft(resp)) return resp;
    this.#image = value;
    return right(undefined);
  }

  get id() {
    return this.#id;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName1() {
    return this.#lastName1;
  }

  get lastName2() {
    return this.#lastName2;
  }

  get image() {
    return this.#image;
  }
}
