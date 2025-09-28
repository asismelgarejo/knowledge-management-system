import { Id } from "@/shared/value-objects";
import { ResourceTypes } from "../constants";

export type BookProps = {
  id: Id;
  title: string;
};

export class Book {
  #id: Id;
  #title: string;
  readonly type = ResourceTypes.BOOK;
  constructor(props: BookProps) {
    this.#title = props.title;
    this.#id = props.id;
  }

  static create(props: BookProps): Book {
    return new Book(props);
  }

  id(): Id {
    return this.#id;
  }

  title(): string {
    return this.#title;
  }
}
