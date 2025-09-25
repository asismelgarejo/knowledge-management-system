// value-objects/book-authors.vo.ts
import { ValueObject } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { BookAuthorsLimitExceededError, DuplicateBookAuthorError, EmptyBookAuthorsError } from "../errors";
import { AuthorFullName } from "./author-fullname.vo";
import { Id } from "./id.vo";

export const MAX_AUTHORS = 5;

type AuthorRef = Readonly<{
  id: Id;
  fullName: AuthorFullName;
}>;

export class BookAuthors extends ValueObject<{ items: ReadonlyArray<AuthorRef> }> {
  private constructor(items: ReadonlyArray<AuthorRef>) {
    const normalized = [...items].sort((a, b) => a.id.toString().localeCompare(b.id.toString()));
    super({ items: Object.freeze(normalized) });
  }

  static create(
    items: ReadonlyArray<AuthorRef>,
  ): E.Either<EmptyBookAuthorsError | DuplicateBookAuthorError | BookAuthorsLimitExceededError, BookAuthors> {
    if (items.length === 0) {
      return E.left(new EmptyBookAuthorsError());
    }
    if (items.length > MAX_AUTHORS) {
      return E.left(new BookAuthorsLimitExceededError(MAX_AUTHORS));
    }
    const seen = new Set<string>();
    for (const a of items) {
      const idStr = a.id.toString();
      if (seen.has(idStr)) {
        return E.left(new DuplicateBookAuthorError(idStr));
      }
      seen.add(idStr);
    }
    return E.right(new BookAuthors(items));
  }

  /** Add an author while preserving invariants (immutable). */
  add(author: AuthorRef): E.Either<DuplicateBookAuthorError | BookAuthorsLimitExceededError, BookAuthors> {
    const id = author.id.toString();

    const existingAuthor = this.props.items.find((a) => a.id.toString() === id);
    if (existingAuthor) {
      return E.left(new DuplicateBookAuthorError(existingAuthor.id.toString()));
    }
    if (this.props.items.length + 1 > MAX_AUTHORS) {
      return E.left(new BookAuthorsLimitExceededError(MAX_AUTHORS));
    }
    return E.right(new BookAuthors([...this.props.items, author]));
  }

  /** Remove an author by id (immutable). */
  remove(id: Id): BookAuthors {
    const target = id.toString();
    const next = this.props.items.filter((a) => a.id.toString() !== target);
    // Business choice: allow 0 after removal or re-enforce non-empty?
    // If you want to keep non-empty invariant always, re-use create(...) and handle Either.
    return new BookAuthors(next);
  }

  size(): number {
    return this.props.items.length;
  }
  values(): ReadonlyArray<AuthorRef> {
    return [...this.props.items];
  }
  toPrimitives(): ReadonlyArray<{ id: string; fullName: string }> {
    return this.props.items.map((a) => ({ id: a.id.toString(), fullName: a.fullName.toPrimitives() }));
  }
}
