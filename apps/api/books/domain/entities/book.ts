import { Id } from "@/shared/value-objects";
import { BookAuthors, BookTitle } from "../value-objects";

export type BookBaseProps = Readonly<{
  id: Id;
  title: BookTitle;
  authors: BookAuthors;
}>;

export abstract class BookBase {
  #id: Id;
  #title: BookTitle;
  #authors: BookAuthors;
  constructor(props: BookBaseProps) {
    this.#title = props.title;
    this.#id = props.id;
    this.#authors = props.authors;
  }

  id(): Id {
    return this.#id;
  }

  title(): BookTitle {
    return this.#title;
  }

  authors(): BookAuthors {
    return this.#authors;
  }

  toPrimitives() {
    return {
      id: this.#id,
      authors: this.#authors,
    };
  }
}
