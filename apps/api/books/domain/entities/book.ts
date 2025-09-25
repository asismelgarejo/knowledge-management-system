// book.ts
import { BookAuthors, BookTitle, Id } from "../value-objects";

type BookProps = Readonly<{
  id: Id;
  title: BookTitle;
  authors: BookAuthors;
}>;

export class Book {
  #id: Id;
  #title: BookTitle;
  #authors: BookAuthors;
  private constructor(props: BookProps) {
    this.#title = props.title;
    this.#id = props.id;
    this.#authors = props.authors;
  }

  static create(props: BookProps): Book {
    return new Book(props);
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
      id: this.#id.toPrimitives(),
      authors: this.#authors.toPrimitives(),
    };
  }
}
